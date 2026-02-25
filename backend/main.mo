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
import Int "mo:core/Int";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Gallery Types
  type Gallery = {
    id : Text;
    title : Text;
    description : Text;
    branch : ?Text;
    semester : ?Text;
    subject : ?Text;
    chapter : ?Text;
    images : [GalleryImage];
    videos : [GalleryVideo];
  };

  type GalleryImage = {
    id : Text;
    blob : Blob;
    fileName : Text;
  };

  type GalleryVideo = {
    id : Text;
    blob : Storage.ExternalBlob;
    fileName : Text;
  };

  // Gallery storage
  let galleries = Map.empty<Text, Gallery>();

  // State for lessons
  let lessons = Map.empty<Text, Lesson>();
  var nextLessonId = 1;

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Subscriptions
  let activeSubscriptions = Set.empty<Principal>();
  let finalizedPurchases = Set.empty<Text>();
  let pendingPurchases = Set.empty<Text>();
  let purchaseAttempts = Map.empty<Text, (Principal, Time.Time, Text)>();

  // Withdrawals
  let withdrawalRequests = Map.empty<Text, WithdrawalRequest>();
  var nextWithdrawalId = 1;

  // Files, video, and links
  let files = Map.empty<Text, File>();
  let videoLinks = Map.empty<Text, VideoLink>();
  let importantLinks = Map.empty<Text, ImportantLink>();

  type WithdrawalRequest = {
    id : Text;
    userId : Principal;
    amount : Float;
    phoneNumber : Text;
    timestamp : Int;
    status : WithdrawalStatus;
  };

  type WithdrawalStatus = {
    #pending;
    #approved;
    #rejected;
    #completed;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    rollNumber : Text;
    branch : Text;
    profilePicture : ?Text;
  };

  type File = {
    id : Text;
    fileType : FileType;
    fileLink : ?Text;
    isEncrypted : Bool;
  };

  type FileType = {
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

  type Lesson = {
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

  type TeacherSchedule = {
    time : Int;
    availability : Bool;
  };

  type Reminders = {
    lessonReminders : [LessonReminder];
  };

  type LessonReminder = {
    text : Text;
    interval : Int;
    isActive : Bool;
  };

  type LessonStatus = {
    #notStarted;
    #started;
    #paused;
    #completed;
  };

  type VideoLink = { id : Text };
  type ImportantLink = { id : Text };

  // Payment record type
  type PaymentRecord = {
    id : Text;
    userId : Principal;
    amount : Nat;
    timestamp : Int;
    status : PaymentStatus;
    stripeSessionId : ?Text;
  };

  type PaymentStatus = {
    #pending;
    #completed;
    #failed;
    #refunded;
  };

  // Payment tracking
  let payments = Map.empty<Text, PaymentRecord>();
  var nextPaymentId = 1;

  // Stripe configuration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    mustBeAdmin(caller);
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  // Only authenticated users should be able to query session status
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Payments info - only accessible to authenticated users
  let phonePePaymentsUPI = "9392412728-2@axl";
  let bankAccountNumber = "122002023499";
  let ifscCode = "ICIC000TRF";

  public query ({ caller }) func getBankAccountDetails() : async (Text, Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bank account details");
    };
    (bankAccountNumber, ifscCode);
  };

  public query ({ caller }) func getPhonePePaymentsUPI() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view UPI details");
    };
    phonePePaymentsUPI;
  };

  // -----------------------------------------
  // User Profiles
  // -----------------------------------------
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

  // -----------------------------------------
  // Lesson / Video Content
  // -----------------------------------------
  public shared ({ caller }) func createLesson(lesson : Lesson) : async Text {
    mustBeAdmin(caller);

    let lessonId = switch (nextLessonId, lesson.id) {
      case (id, _) { id.toText() };
    };
    lessons.add(lessonId, lesson);
    nextLessonId += 1;
    lessonId;
  };

  public shared ({ caller }) func updateLesson(lessonId : Text, updatedLesson : Lesson) : async () {
    mustBeAdmin(caller);

    if (not lessons.containsKey(lessonId)) {
      Runtime.trap("Lesson does not exist");
    };
    lessons.add(lessonId, updatedLesson);
  };

  public shared ({ caller }) func deleteLesson(lessonId : Text) : async () {
    mustBeAdmin(caller);

    if (not lessons.containsKey(lessonId)) {
      Runtime.trap("Lesson does not exist");
    };
    lessons.remove(lessonId);
  };

  public query ({ caller }) func getLesson(lessonId : Text) : async Lesson {
    if (not (isExplicitAdmin(caller) or AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get lessons");
    };

    // Admins can always access (skip subscription check)
    if (not isExplicitAdmin(caller)) {
      checkSubscriptionActive(caller);
    };

    switch (lessons.get(lessonId)) {
      case (null) { Runtime.trap("Lesson does not exist") };
      case (?lesson) { lesson };
    };
  };

  public query ({ caller }) func getAllLessons() : async [Lesson] {
    if (not (isExplicitAdmin(caller) or AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view lessons");
    };

    // Admins can always access (skip subscription check)
    if (not isExplicitAdmin(caller)) {
      checkSubscriptionActive(caller);
    };

    lessons.values().toArray();
  };

  func checkSubscriptionActive(caller : Principal) : () {
    if (not activeSubscriptions.contains(caller)) {
      Runtime.trap(
        "Access restricted: You need a valid weekly subscription to access course content. Contact +91 9392412728 to activate your subscription."
      );
    };
  };

  // -----------------------------------------
  // Lesson Timers
  // -----------------------------------------
  let lessonStatuses = Map.empty<Text, LessonStatus>();
  let lessonTimers = Map.empty<Text, Int>();
  let lessonTimeSpent = Map.empty<Text, Int>();

  type LessonStatusUpdate = {
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

  // -----------------------------------------
  // Withdrawal Requests
  // -----------------------------------------
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
      timestamp = Time.now();
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
        if (AccessControl.isAdmin(accessControlState, caller) or request.userId == caller) {
          ?request;
        } else {
          Runtime.trap("Unauthorized: Can only view your own withdrawal requests");
        };
      };
    };
  };

  public query ({ caller }) func getAllWithdrawalRequests() : async [WithdrawalRequest] {
    mustBeAdmin(caller);
    withdrawalRequests.values().toArray();
  };

  public shared ({ caller }) func updateWithdrawalStatus(withdrawalId : Text, newStatus : WithdrawalStatus) : async () {
    mustBeAdmin(caller);

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

  // -----------------------------------------
  // Subscription / Payment for Content
  // -----------------------------------------

  // Admin-only: exposes all subscribed principals
  public query ({ caller }) func getActiveSubscriptions() : async [Principal] {
    mustBeAdmin(caller);
    activeSubscriptions.toArray();
  };

  // Admin-only: exposes internal purchase tracking data
  public query ({ caller }) func getPendingPurchases() : async [Text] {
    mustBeAdmin(caller);
    pendingPurchases.toArray();
  };

  // Admin-only: exposes internal purchase tracking data
  public query ({ caller }) func getFinalizedPurchases() : async [Text] {
    mustBeAdmin(caller);
    finalizedPurchases.toArray();
  };

  public query ({ caller }) func checkSubscriptionStatus() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check subscription status");
    };
    activeSubscriptions.contains(caller);
  };

  public query ({ caller }) func isSubscriptionActive() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check subscription status");
    };
    activeSubscriptions.contains(caller);
  };

  public query ({ caller }) func getAllActiveSubscriptions() : async [Principal] {
    mustBeAdmin(caller);
    activeSubscriptions.toArray();
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Finalize payment & activate subscription
  public shared ({ caller }) func finalizeStripeCheckout(sessionId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can finalize checkouts");
    };

    let status = await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
    switch (status) {
      case (#completed { response; userPrincipal }) {
        if (finalizedPurchases.contains(sessionId)) {
          true;
        } else {
          finalizedPurchases.add(sessionId);
          let principal = caller;

          // Create payment record
          let paymentId = nextPaymentId.toText();
          let paymentRecord : PaymentRecord = {
            id = paymentId;
            userId = principal;
            amount = 0; // Amount should be extracted from Stripe response
            timestamp = Time.now();
            status = #completed;
            stripeSessionId = ?sessionId;
          };
          payments.add(paymentId, paymentRecord);
          nextPaymentId += 1;

          activateSubscription(principal, true);
          true;
        };
      };
      case (_) {
        false;
      };
    };
  };

  func activateSubscription(principal : Principal, _fromStripe : Bool) {
    activeSubscriptions.add(principal);
  };

  // Admin function to manually activate user account after payment confirmation
  public shared ({ caller }) func activateUserAccount(userId : Principal) : async () {
    mustBeAdmin(caller);

    // Create a payment record for manual activation
    let paymentId = nextPaymentId.toText();
    let paymentRecord : PaymentRecord = {
      id = paymentId;
      userId = userId;
      amount = 0; // Manual activation, amount tracked separately
      timestamp = Time.now();
      status = #completed;
      stripeSessionId = null;
    };
    payments.add(paymentId, paymentRecord);
    nextPaymentId += 1;

    // Activate subscription
    activeSubscriptions.add(userId);
  };

  // Admin function to deactivate user account
  public shared ({ caller }) func deactivateUserAccount(userId : Principal) : async () {
    mustBeAdmin(caller);
    activeSubscriptions.remove(userId);
  };

  // Admin-only access to all payments
  public query ({ caller }) func getAllPayments() : async [PaymentRecord] {
    mustBeAdmin(caller);
    payments.values().toArray();
  };

  // Only allow viewing own payment or admin access
  public query ({ caller }) func getPaymentById(paymentId : Text) : async ?PaymentRecord {
    switch (payments.get(paymentId)) {
      case (null) { null };
      case (?payment) {
        if (caller == payment.userId or AccessControl.isAdmin(accessControlState, caller)) {
          ?payment;
        } else {
          Runtime.trap("Unauthorized: Can only view your own payments");
        };
      };
    };
  };

  // Users can view their own payments, admins can view any user's payments
  public query ({ caller }) func getUserPayments(userId : Principal) : async [PaymentRecord] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own payments");
    };
    payments.values().toArray().filter(func(p) { p.userId == userId });
  };

  // Get caller's own payments
  public query ({ caller }) func getCallerPayments() : async [PaymentRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view payments");
    };
    payments.values().toArray().filter(func(p) { p.userId == caller });
  };

  // Method to update payment status (admin only)
  public shared ({ caller }) func updatePaymentStatus(paymentId : Text, newStatus : PaymentStatus) : async () {
    mustBeAdmin(caller);

    switch (payments.get(paymentId)) {
      case (null) { Runtime.trap("Payment record not found") };
      case (?payment) {
        let updatedPayment : PaymentRecord = {
          id = payment.id;
          userId = payment.userId;
          amount = payment.amount;
          timestamp = payment.timestamp;
          status = newStatus;
          stripeSessionId = payment.stripeSessionId;
        };
        payments.add(paymentId, updatedPayment);
      };
    };
  };

  // -----------------------------------------
  // File/Content Management
  // -----------------------------------------
  public shared ({ caller }) func deleteFile(_fileId : Text) : async () {
    mustBeAdmin(caller);
  };

  // -----------------------------------------
  // Video & Important Links Management
  // -----------------------------------------
  public shared ({ caller }) func deleteVideoLink(_linkId : Text) : async () {
    mustBeAdmin(caller);
  };

  public shared ({ caller }) func deleteImportantLink(_linkId : Text) : async () {
    mustBeAdmin(caller);
  };

  // -----------------------------------------
  // Bulk Folder/Category Deletion
  // -----------------------------------------
  public shared ({ caller }) func deleteCategory(_categoryId : Text) : async () {
    mustBeAdmin(caller);
  };

  public shared ({ caller }) func bulkDeleteCategories(_categoryIds : [Text]) : async () {
    mustBeAdmin(caller);
  };

  // -----------------------------------------
  // Bulk Upload Functionality
  // -----------------------------------------
  type UploadedFiles = {
    files : [File];
  };

  public shared ({ caller }) func bulkUpload(_data : UploadedFiles) : async () {
    mustBeAdmin(caller);
  };

  // -----------------------------------------
  // File Size Validation (Stub - Left to Frontend)
  // -----------------------------------------
  public query func validateFileSize(_fileSize : Nat) : async Bool {
    true;
  };

  // -----------------------------------------
  // Content Duplication Detection (Stub - Left to Frontend)
  // -----------------------------------------
  public query func checkForDuplicates(_fileName : Text, _category : Text) : async Bool {
    false;
  };

  // -----------------------------------------
  // Disabled Admin Password Auth
  // -----------------------------------------
  public shared ({ caller }) func saveAdminPassword(_password : Text) : async () {
    Runtime.trap("Unsupported: Password management is handled by Google authentication");
  };

  public shared ({ caller }) func authenticateAdmin(_incomingPassword : Text) : async Bool {
    false;
  };

  public query ({ caller }) func isPasswordSet() : async Bool {
    false;
  };

  // -----------------------------------------
  // Gallery Management Methods
  // -----------------------------------------
  public shared ({ caller }) func createGallery(title : Text, description : Text, branch : ?Text, semester : ?Text, subject : ?Text, chapter : ?Text) : async Text {
    mustBeAdmin(caller);

    let galleryId = title.concat("_").concat(Time.now().toText());
    let emptyGallery : Gallery = {
      id = galleryId;
      title;
      description;
      branch;
      semester;
      subject;
      chapter;
      images = [];
      videos = [];
    };

    galleries.add(galleryId, emptyGallery);
    galleryId;
  };

  public shared ({ caller }) func uploadGalleryImages(galleryId : Text, images : [GalleryImage]) : async () {
    mustBeAdmin(caller);

    switch (galleries.get(galleryId)) {
      case (null) { Runtime.trap("Gallery not found") };
      case (?gallery) {
        let updatedImages = gallery.images.concat(images);
        let updatedGallery = {
          gallery with
          images = updatedImages;
        };
        galleries.add(galleryId, updatedGallery);
      };
    };
  };

  public shared ({ caller }) func uploadGalleryVideos(galleryId : Text, videos : [GalleryVideo]) : async () {
    mustBeAdmin(caller);

    switch (galleries.get(galleryId)) {
      case (null) { Runtime.trap("Gallery not found") };
      case (?gallery) {
        let updatedVideos = gallery.videos.concat(videos);
        let updatedGallery = {
          gallery with
          videos = updatedVideos;
        };
        galleries.add(galleryId, updatedGallery);
      };
    };
  };

  public query ({ caller }) func getGalleryById(galleryId : Text) : async ?Gallery {
    if (not isExplicitAdmin(caller) and not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view galleries");
    };
    if (not isExplicitAdmin(caller)) {
      checkSubscriptionActive(caller);
    };
    galleries.get(galleryId);
  };

  public query ({ caller }) func getGalleriesByCategory(_branch : ?Text, _semester : ?Text, _subject : ?Text, _chapter : ?Text) : async [Gallery] {
    if (not isExplicitAdmin(caller) and not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view galleries");
    };
    if (not isExplicitAdmin(caller)) {
      checkSubscriptionActive(caller);
    };

    galleries.values().toArray();
  };

  public shared ({ caller }) func deleteGallery(galleryId : Text) : async () {
    mustBeAdmin(caller);
    galleries.remove(galleryId);
  };

  public shared ({ caller }) func deleteGalleryImage(galleryId : Text, imageId : Text) : async () {
    mustBeAdmin(caller);

    switch (galleries.get(galleryId)) {
      case (null) { Runtime.trap("Gallery not found") };
      case (?gallery) {
        let filteredImages = gallery.images.filter(func(img) { img.id != imageId });
        let updatedGallery = {
          gallery with
          images = filteredImages;
        };
        galleries.add(galleryId, updatedGallery);
      };
    };
  };

  public shared ({ caller }) func deleteGalleryVideo(galleryId : Text, videoId : Text) : async () {
    mustBeAdmin(caller);

    switch (galleries.get(galleryId)) {
      case (null) { Runtime.trap("Gallery not found") };
      case (?gallery) {
        let filteredVideos = gallery.videos.filter(func(video) { video.id != videoId });
        let updatedGallery = {
          gallery with
          videos = filteredVideos;
        };
        galleries.add(galleryId, updatedGallery);
      };
    };
  };

  public query ({ caller }) func getGalleryVideos(galleryId : Text) : async [GalleryVideo] {
    if (not isExplicitAdmin(caller) and not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view gallery videos");
    };
    if (not isExplicitAdmin(caller)) {
      checkSubscriptionActive(caller);
    };

    switch (galleries.get(galleryId)) {
      case (null) { [] };
      case (?gallery) { gallery.videos };
    };
  };

  //------------------------------------------
  // Explicit Admin Permission Checks
  //------------------------------------------
  func mustBeAdmin(caller : Principal) : () {
    if (not (isExplicitAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func isExplicitAdmin(caller : Principal) : Bool {
    let adminPrincipalText = "p5uca-z2tjs-4c64f-2frbf-ednap-su735-yzal4-m4ovw-vb7eq-p3oxp-aaq";
    caller.toText() == adminPrincipalText;
  };
};
