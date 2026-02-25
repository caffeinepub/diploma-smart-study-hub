import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

module {
  // Types from original code (should match old actor structure)
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

  type StripePaymentRecord = {
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

  type OldActor = {
    galleries : Map.Map<Text, Gallery>;
    lessons : Map.Map<Text, Lesson>;
    nextLessonId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    activeSubscriptions : Set.Set<Principal>;
    finalizedPurchases : Set.Set<Text>;
    pendingPurchases : Set.Set<Text>;
    purchaseAttempts : Map.Map<Text, (Principal, Time.Time, Text)>;
    withdrawalRequests : Map.Map<Text, WithdrawalRequest>;
    nextWithdrawalId : Nat;
    files : Map.Map<Text, File>;
    videoLinks : Map.Map<Text, VideoLink>;
    importantLinks : Map.Map<Text, ImportantLink>;
    payments : Map.Map<Text, StripePaymentRecord>;
    nextPaymentId : Nat;
    configuration : ?Stripe.StripeConfiguration;
    accessControlState : AccessControl.AccessControlState;
  };

  type VideoLink = { id : Text };
  type ImportantLink = { id : Text };
  type UserProfile = {
    name : Text;
    email : Text;
    rollNumber : Text;
    branch : Text;
    profilePicture : ?Text;
  };

  // Migration function (keeps existing state and updates actor type)
  public func run(old : OldActor) : OldActor {
    old;
  };
};
