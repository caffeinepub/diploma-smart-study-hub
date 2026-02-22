import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  // Include access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State for keeping lessons data
  let lessons = Map.empty<Text, Lesson>();
  var nextLessonId = 1;

  // State for user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // State for withdrawal requests with phone numbers
  public type WithdrawalRequest = {
    id : Text;
    userId : Principal;
    amount : Float;
    phoneNumber : Text;
    timestamp : Int;
    status : WithdrawalStatus;
  };

  public type WithdrawalStatus = {
    #pending;
    #approved;
    #rejected;
    #completed;
  };

  let withdrawalRequests = Map.empty<Text, WithdrawalRequest>();
  var nextWithdrawalId = 1;

  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
    rollNumber : Text;
    branch : Text;
    profilePicture : ?Text;
  };

  public type Lesson = {
    id : Text;
    title : Text;
    description : Text;
    teacherName : Text;
    teacherSchedule : [TeacherSchedule];
    startTime : Int;
    endTime : Int;
    periodicReminders : Reminders;
    files : [File];
    videoLink : ?Text;
    rating : Float;
    ratingsCount : Nat;
  };

  public type TeacherSchedule = {
    time : Int;
    availability : Bool;
  };

  public type Reminders = {
    lessonReminders : [LessonReminder];
  };

  public type File = {
    id : Text;
    fileType : FileType;
    fileLink : ?Text;
    isEncrypted : Bool;
  };

  public type FileType = {
    #pdf;
    #jpeg;
    #pdfEncrypted;
    #mp4;
    #notes;
    #pdfWithQRCode;
    #zoomChart;
    #clarifiedPdf;
    #screenshot;
    #mp3Audio;
    #answeredQueries;
    #shortVideo;
    #longVideo;
  };

  public type LessonReminder = {
    text : Text;
    interval : Int;
    isActive : Bool;
  };

  public type LessonStatus = {
    #notStarted;
    #started;
    #paused;
    #completed;
  };

  // MCF Phone Number for Receipts
  let mcfPhoneNumber : Text = "9392412728";

  public query func getPhoneNumber() : async Text {
    // Public access - anyone including guests needs to see where to send payments
    mcfPhoneNumber;
  };

  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Lesson Management Functions
  public shared ({ caller }) func createLesson(lesson : Lesson) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create lessons");
    };
    let lessonId = nextLessonId.toText();
    lessons.add(lessonId, lesson);
    nextLessonId += 1;
    lessonId;
  };

  public shared ({ caller }) func updateLesson(lessonId : Text, updatedLesson : Lesson) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update lessons");
    };
    if (not lessons.containsKey(lessonId)) {
      Runtime.trap("Lesson does not exist");
    };
    lessons.add(lessonId, updatedLesson);
  };

  public shared ({ caller }) func deleteLesson(lessonId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete lessons");
    };
    if (not lessons.containsKey(lessonId)) {
      Runtime.trap("Lesson does not exist");
    };
    lessons.remove(lessonId);
  };

  public query ({ caller }) func getLesson(lessonId : Text) : async Lesson {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get lessons");
    };
    switch (lessons.get(lessonId)) {
      case (null) { Runtime.trap("Lesson does not exist") };
      case (?lesson) { lesson };
    };
  };

  public query ({ caller }) func getAllLessons() : async [Lesson] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view lessons");
    };
    lessons.values().toArray();
  };

  // Lesson Timer/Lesson Status Functions
  let lessonStatuses = Map.empty<Text, LessonStatus>();
  let lessonTimers = Map.empty<Text, Int>();
  let lessonTimeSpent = Map.empty<Text, Int>();

  public type LessonStatusUpdate = {
    lessonId : Text;
    newStatus : LessonStatus;
  };

  public shared ({ caller }) func updateLessonStatus(update : LessonStatusUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update lesson status");
    };
    lessonStatuses.add(update.lessonId, update.newStatus);

    switch (update.newStatus) {
      case (#started) {
        lessonTimers.add(update.lessonId, 1);
      };
      case (#paused) {
        switch (lessonTimers.get(update.lessonId)) {
          case (?currentTime) {
            let timeSpent = switch (lessonTimeSpent.get(update.lessonId)) {
              case (?time) { time + currentTime };
              case (null) { currentTime };
            };
            lessonTimeSpent.add(update.lessonId, timeSpent);
            lessonTimers.remove(update.lessonId);
          };
          case (null) {};
        };
      };
      case (#completed) {
        lessonTimers.remove(update.lessonId);
      };
      case (#notStarted) {
        lessonTimers.remove(update.lessonId);
        lessonTimeSpent.remove(update.lessonId);
      };
    };
  };

  public query ({ caller }) func getLessonStatus(lessonId : Text) : async LessonStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get lesson status");
    };
    switch (lessonStatuses.get(lessonId)) {
      case (null) { Runtime.trap("Lesson status not found") };
      case (?status) { status };
    };
  };

  public query ({ caller }) func getLessonTimeSpent(lessonId : Text) : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get lesson time spent");
    };
    switch (lessonTimeSpent.get(lessonId)) {
      case (null) { 0 };
      case (?time) { time };
    };
  };

  // Withdrawal Request Management
  public shared ({ caller }) func submitWithdrawalRequest(amount : Float, phoneNumber : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit withdrawal requests");
    };

    let withdrawalId = nextWithdrawalId.toText();
    let request : WithdrawalRequest = {
      id = withdrawalId;
      userId = caller;
      amount = amount;
      phoneNumber = phoneNumber;
      timestamp = 0; // In production, use Time.now()
      status = #pending;
    };

    withdrawalRequests.add(withdrawalId, request);
    nextWithdrawalId += 1;
    withdrawalId;
  };

  public query ({ caller }) func getWithdrawalRequest(withdrawalId : Text) : async ?WithdrawalRequest {
    switch (withdrawalRequests.get(withdrawalId)) {
      case (null) { null };
      case (?request) {
        // Admin can view all requests, or user can view their own
        if (AccessControl.isAdmin(accessControlState, caller) or request.userId == caller) {
          ?request;
        } else {
          Runtime.trap("Unauthorized: Can only view your own withdrawal requests");
        };
      };
    };
  };

  public query ({ caller }) func getAllWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawal requests");
    };
    withdrawalRequests.values().toArray();
  };

  public shared ({ caller }) func updateWithdrawalStatus(withdrawalId : Text, newStatus : WithdrawalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update withdrawal status");
    };

    switch (withdrawalRequests.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?request) {
        let updatedRequest : WithdrawalRequest = {
          id = request.id;
          userId = request.userId;
          amount = request.amount;
          phoneNumber = request.phoneNumber;
          timestamp = request.timestamp;
          status = newStatus;
        };
        withdrawalRequests.add(withdrawalId, updatedRequest);
      };
    };
  };

  // ------ Disabled Admin Password Authentication ------
  public shared ({ caller }) func saveAdminPassword(_password : Text) : async () {
    Runtime.trap("This method is currently not supported due to lack of secure password hashing.");
  };

  public shared ({ caller }) func authenticateAdmin(_incomingPassword : Text) : async Bool {
    false;
  };

  public query ({ caller }) func isPasswordSet() : async Bool {
    false;
  };
};
