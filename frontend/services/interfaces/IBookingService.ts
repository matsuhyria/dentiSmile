import { EventEmitter } from 'events'

export interface IBookingService {
    requestAppointment(appointmentId: string, patientId: string): EventEmitter

    cancelBooking(bookingId: string): EventEmitter

    getBookings(patientId: string): EventEmitter

    getBookingAppointments(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): EventEmitter

    disconnect(): Promise<void>
}

export interface BookingResponse {
    appointmentId: string
    status: 'confirmed' | 'pending' | 'rejected'
    dateTime: string
}

export interface BookingRequest {
    appointmentId: string
    patientId: string
}
