/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBookingService } from './interfaces/IBookingService'
import { MQTT_TOPICS } from './base/MQTTService'
import { BaseBookingService } from './BaseBookingService'
import {
    RequestResponseManager,
    RequestType
} from '@/lib/RequestResponseManager'
import { IAppointment } from './interfaces/IAppointment'
import { IBooking } from './interfaces/IBooking'

interface BookingResponse {
    appointmentId: string
    dateTime: string
    status: 'confirmed' | 'pending' | 'rejected'
    [key: string]: any
}

export class BookingService
    extends BaseBookingService
    implements IBookingService {
    public async cancelBooking(
        appointmentId: string,
    ): Promise<{ error?: string; data?: Record<string, unknown> }> {
        try {
            const data = await this.requestManager.request(
                MQTT_TOPICS.APPOINTMENT.CANCEL.REQUEST,
                MQTT_TOPICS.APPOINTMENT.CANCEL.RESPONSE(''),
                { appointmentId },
                this.client,
                RequestType.DIRECT
            )
            return { data }
        } catch (error) {
            throw new Error(`Failed to cancel booking: ${error.message}`)
        }
    }
    protected requestManager: RequestResponseManager<any>

    constructor(client: any) {
        super(client)
        this.requestManager = new RequestResponseManager()

        if (!client || typeof client.on !== 'function') {
            throw new Error('Invalid MQTT client provided')
        }
    }

    public async requestAppointment(
        appointmentId: string,
        patientId: string
    ): Promise<{ error?: string; data?: BookingResponse }> {
        try {
            const data = await this.requestManager.request(
                MQTT_TOPICS.APPOINTMENT.BOOK.REQUEST,
                MQTT_TOPICS.APPOINTMENT.BOOK.RESPONSE(''),
                { appointmentId, patientId },
                this.client,
                RequestType.DIRECT
            )

            return {
                data
            }
        } catch (error) {
            return { error: `Failed to book appointment: ${error.message}` }
        }
    }

    public async getBookings(
        patientId: string
    ): Promise<{ data: IBooking[] }> {
        try {
            const data = await this.requestManager.request(
                MQTT_TOPICS.APPOINTMENT.PATIENT.RETRIEVE.REQUEST,
                MQTT_TOPICS.APPOINTMENT.PATIENT.RETRIEVE.RESPONSE(''),
                { patientId },
                this.client,
                RequestType.DIRECT
            )
            console.log('DATA', data);
            return { data }
        } catch (error) {
            throw new Error(`Failed to retrieve bookings: ${error.message}`)
        }
    }

    public async getBookingAppointments(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ data: IAppointment[] }> {
        try {
            const data = await this.requestManager.request(
                MQTT_TOPICS.APPOINTMENT.GET.REQUEST,
                MQTT_TOPICS.APPOINTMENT.GET.RESPONSE,
                { clinicId, reasonId, date },
                this.client,
                RequestType.DIRECT
            )
            console.log('DATA', data);
            return { data }
        } catch (error) {
            throw new Error(`Failed to retrieve appointments: ${error.message}`)
        }
    }

    public async disconnect(): Promise<void> {
        return Promise.resolve()
    }
}
