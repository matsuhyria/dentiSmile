export interface IBookingService {
    requestAppointment(
        clinicId: string,
        reasonId: string,
        date: string,
        slot: string
    ): Promise<{ error?: string; data?: Record<string, unknown> }>;
    disconnect(): Promise<void>;
}
