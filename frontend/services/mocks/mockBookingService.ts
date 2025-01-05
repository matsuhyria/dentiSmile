import { BaseBookingService } from '../BaseBookingService'
import { IAppointment } from '../interfaces/IAppointment'
import { IBooking } from '../interfaces/IBooking'
import { BookingResponse, IBookingService } from '../interfaces/IBookingService'

class MockBookingService extends BaseBookingService implements IBookingService {
    constructor() {
        super(null)
    }

    async requestAppointment(
        appointmentId: string
    ): Promise<{ data: BookingResponse }> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
            data: {
                appointmentId,
                status: 'confirmed',
                dateTime: new Date().toISOString()
            }
        }
    }
    public async cancelBooking(
        bookingId: string
    ): Promise<{ error?: string; data?: Record<string, unknown> }> {
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

        if (!bookingId) {
            return { error: 'Booking ID is required' }
        }

        return {
            data: {
                bookingId,
                status: 'cancelled',
                cancelledAt: new Date().toISOString()
            }
        }
    }

    public getBookings(): Promise<{ data: IBooking[] }> {
        throw new Error('Method not implemented.')
    }

    public getBookingAppointments(): Promise<{
        error?: string
        data?: IAppointment[]
    }> {
        throw new Error('Method not implemented.')
    }

    public disconnect(): Promise<void> {
        throw new Error('Method not implemented.')
    }
}

export default MockBookingService
