import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";
import Storage "blob-storage/Storage";
import Int "mo:core/Int";

module {
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

  type OldState = {
    galleries : Map.Map<Text, Gallery>;
    lessons : Map.Map<Text, Lesson>;
    nextLessonId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    activeSubscriptions : Set.Set<Principal>;
    finalizedPurchases : Set.Set<Text>;
    pendingPurchases : Set.Set<Text>;
    withdrawalRequests : Map.Map<Text, WithdrawalRequest>;
    nextWithdrawalId : Nat;
    files : Map.Map<Text, File>;
    payments : Map.Map<Text, PaymentRecord>;
    nextPaymentId : Nat;
    lessonStatuses : Map.Map<Text, LessonStatus>;
    lessonTimers : Map.Map<Text, Int>;
    lessonTimeSpent : Map.Map<Text, Int>;
    configuration : ?Stripe.StripeConfiguration;
    mcfPhoneNumber : Text;
  };

  type NewState = {
    galleries : Map.Map<Text, Gallery>;
    lessons : Map.Map<Text, Lesson>;
    nextLessonId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    activeSubscriptions : Set.Set<Principal>;
    finalizedPurchases : Set.Set<Text>;
    pendingPurchases : Set.Set<Text>;
    withdrawalRequests : Map.Map<Text, WithdrawalRequest>;
    nextWithdrawalId : Nat;
    files : Map.Map<Text, File>;
    payments : Map.Map<Text, PaymentRecord>;
    nextPaymentId : Nat;
    lessonStatuses : Map.Map<Text, LessonStatus>;
    lessonTimers : Map.Map<Text, Int>;
    lessonTimeSpent : Map.Map<Text, Int>;
    configuration : ?Stripe.StripeConfiguration;
    phonePePaymentsUPI : Text;
    bankAccountNumber : Text;
    ifscCode : Text;
  };

  public func run(old : OldState) : NewState {
    {
      old with
      phonePePaymentsUPI = "9392412728-2@axl";
      bankAccountNumber = "122002023499";
      ifscCode = "ICIC000TRF";
    };
  };
};
