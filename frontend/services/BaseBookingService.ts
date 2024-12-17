/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookingResponse, IBookingService } from './interfaces/IBookingService'
import { IBooking } from './interfaces/IBooking'
import { IAppointment } from './interfaces/IAppointment'
import { RequestResponseManager } from '@/lib/RequestResponseManager'

export abstract class BaseBookingService implements IBookingService {
    protected client: any
    protected requestManager: RequestResponseManager<any>

    constructor(client: any) {
        this.client = client
        this.requestManager = new RequestResponseManager<any>()
    }
    public abstract requestAppointment(
        appointmentId: string,
        patientId: string
    ): Promise<{ error?: string; data?: BookingResponse }>
    public abstract cancelBooking(
        bookingId: string
    ): Promise<{ error?: string; data?: Record<string, unknown> }>
    public abstract getBookings(): Promise<{ data: IBooking[] }>

    public abstract getBookingAppointments(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ error?: string; data?: IAppointment[] }>

    public abstract disconnect(): Promise<void>
}
