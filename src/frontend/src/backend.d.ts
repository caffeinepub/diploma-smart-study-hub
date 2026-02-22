import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reminders {
    lessonReminders: Array<LessonReminder>;
}
export interface LessonStatusUpdate {
    lessonId: string;
    newStatus: LessonStatus;
}
export interface LessonReminder {
    interval: bigint;
    text: string;
    isActive: boolean;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface File {
    id: string;
    isEncrypted: boolean;
    fileLink?: string;
    fileType: FileType;
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
export interface TeacherSchedule {
    time: bigint;
    availability: boolean;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticateAdmin(_incomingPassword: string): Promise<boolean>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createLesson(lesson: Lesson): Promise<string>;
    deleteLesson(lessonId: string): Promise<void>;
    getAllLessons(): Promise<Array<Lesson>>;
    getAllWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLesson(lessonId: string): Promise<Lesson>;
    getLessonStatus(lessonId: string): Promise<LessonStatus>;
    getLessonTimeSpent(lessonId: string): Promise<bigint>;
    getPhoneNumber(): Promise<string>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWithdrawalRequest(withdrawalId: string): Promise<WithdrawalRequest | null>;
    isCallerAdmin(): Promise<boolean>;
    isPasswordSet(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveAdminPassword(_password: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitWithdrawalRequest(amount: number, phoneNumber: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateLesson(lessonId: string, updatedLesson: Lesson): Promise<void>;
    updateLessonStatus(update: LessonStatusUpdate): Promise<void>;
    updateWithdrawalStatus(withdrawalId: string, newStatus: WithdrawalStatus): Promise<void>;
}
