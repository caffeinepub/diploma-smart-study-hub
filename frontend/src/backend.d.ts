import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface PaymentRecord {
    id: string;
    status: PaymentStatus;
    userId: Principal;
    timestamp: bigint;
    stripeSessionId?: string;
    amount: bigint;
}
export interface Lesson {
    id: string;
    files: Array<File>;
    startTime: bigint;
    title: string;
    endTime: bigint;
    description: string;
    teacherName: string;
    videoLink?: string;
    periodicReminders: Reminders;
    rating: number;
    ratingsCount: bigint;
    teacherSchedule: Array<TeacherSchedule>;
}
export interface GalleryImage {
    id: string;
    blob: Uint8Array;
    fileName: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Gallery {
    id: string;
    title: string;
    branch?: string;
    semester?: string;
    subject?: string;
    description: string;
    chapter?: string;
    videos: Array<GalleryVideo>;
    images: Array<GalleryImage>;
}
export interface GalleryVideo {
    id: string;
    blob: ExternalBlob;
    fileName: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface LessonStatusUpdate {
    lessonId: string;
    newStatus: LessonStatus;
}
export interface File {
    id: string;
    isEncrypted: boolean;
    fileLink?: string;
    fileType: FileType;
}
export interface UploadedFiles {
    files: Array<File>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TeacherSchedule {
    time: bigint;
    availability: boolean;
}
export interface Reminders {
    lessonReminders: Array<LessonReminder>;
}
export interface LessonReminder {
    interval: bigint;
    text: string;
    isActive: boolean;
}
export interface WithdrawalRequest {
    id: string;
    status: WithdrawalStatus;
    userId: Principal;
    timestamp: bigint;
    phoneNumber: string;
    amount: number;
}
export interface UserProfile {
    branch: string;
    name: string;
    email: string;
    rollNumber: string;
    profilePicture?: string;
}
export enum FileType {
    mp4 = "mp4",
    pdf = "pdf",
    clarifiedPdf = "clarifiedPdf",
    jpeg = "jpeg",
    answeredQueries = "answeredQueries",
    shortVideo = "shortVideo",
    notes = "notes",
    longVideo = "longVideo",
    mp3Audio = "mp3Audio",
    pdfEncrypted = "pdfEncrypted",
    zoomChart = "zoomChart",
    screenshot = "screenshot",
    pdfWithQRCode = "pdfWithQRCode"
}
export enum LessonStatus {
    notStarted = "notStarted",
    started = "started",
    completed = "completed",
    paused = "paused"
}
export enum PaymentStatus {
    pending = "pending",
    completed = "completed",
    refunded = "refunded",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WithdrawalStatus {
    pending = "pending",
    completed = "completed",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    activateUserAccount(userId: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticateAdmin(_incomingPassword: string): Promise<boolean>;
    bulkDeleteCategories(_categoryIds: Array<string>): Promise<void>;
    bulkUpload(_data: UploadedFiles): Promise<void>;
    checkForDuplicates(_fileName: string, _category: string): Promise<boolean>;
    checkSubscriptionStatus(): Promise<boolean>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createGallery(title: string, description: string, branch: string | null, semester: string | null, subject: string | null, chapter: string | null): Promise<string>;
    createLesson(lesson: Lesson): Promise<string>;
    deactivateUserAccount(userId: Principal): Promise<void>;
    deleteCategory(_categoryId: string): Promise<void>;
    deleteFile(_fileId: string): Promise<void>;
    deleteGallery(galleryId: string): Promise<void>;
    deleteGalleryImage(galleryId: string, imageId: string): Promise<void>;
    deleteGalleryVideo(galleryId: string, videoId: string): Promise<void>;
    deleteImportantLink(_linkId: string): Promise<void>;
    deleteLesson(lessonId: string): Promise<void>;
    deleteVideoLink(_linkId: string): Promise<void>;
    finalizeStripeCheckout(sessionId: string): Promise<boolean>;
    getActiveSubscriptions(): Promise<Array<Principal>>;
    getAllActiveSubscriptions(): Promise<Array<Principal>>;
    getAllLessons(): Promise<Array<Lesson>>;
    getAllPayments(): Promise<Array<PaymentRecord>>;
    getAllWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getBankAccountDetails(): Promise<[string, string]>;
    getCallerPayments(): Promise<Array<PaymentRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFinalizedPurchases(): Promise<Array<string>>;
    getGalleriesByCategory(_branch: string | null, _semester: string | null, _subject: string | null, _chapter: string | null): Promise<Array<Gallery>>;
    getGalleryById(galleryId: string): Promise<Gallery | null>;
    getGalleryVideos(galleryId: string): Promise<Array<GalleryVideo>>;
    getLesson(lessonId: string): Promise<Lesson>;
    getLessonStatus(lessonId: string): Promise<LessonStatus>;
    getLessonTimeSpent(lessonId: string): Promise<bigint>;
    getPaymentById(paymentId: string): Promise<PaymentRecord | null>;
    getPendingPurchases(): Promise<Array<string>>;
    getPhonePePaymentsUPI(): Promise<string>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserPayments(userId: Principal): Promise<Array<PaymentRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWithdrawalRequest(withdrawalId: string): Promise<WithdrawalRequest | null>;
    isCallerAdmin(): Promise<boolean>;
    isPasswordSet(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    isSubscriptionActive(): Promise<boolean>;
    saveAdminPassword(_password: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitWithdrawalRequest(amount: number, phoneNumber: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateLesson(lessonId: string, updatedLesson: Lesson): Promise<void>;
    updateLessonStatus(update: LessonStatusUpdate): Promise<void>;
    updatePaymentStatus(paymentId: string, newStatus: PaymentStatus): Promise<void>;
    updateWithdrawalStatus(withdrawalId: string, newStatus: WithdrawalStatus): Promise<void>;
    uploadGalleryImages(galleryId: string, images: Array<GalleryImage>): Promise<void>;
    uploadGalleryVideos(galleryId: string, videos: Array<GalleryVideo>): Promise<void>;
    validateFileSize(_fileSize: bigint): Promise<boolean>;
}
