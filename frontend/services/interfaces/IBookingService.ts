export interface IBookingService {
    requestAppointment(
        appointmentId: string,
        patientId: string
    ): Promise<{ error?: string; data?: BookingResponse }>
    disconnect(): Promise<void>
}

export interface BookingResponse {
    appointmentId: string;
    status: 'confirmed' | 'pending' | 'rejected';
    dateTime: string;
}

export interface BookingRequest {
    appointmentId: string
    patientId: string
}
