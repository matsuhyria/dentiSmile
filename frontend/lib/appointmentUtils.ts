import { IAppointment } from '@/services/interfaces/IAppointment'
import { parseDateTime } from './dateUtils'

export interface TimeSlot {
    time: string
    appointmentId: string
}

export interface TransformedAppointments {
    monthlyAvailability: Record<string, number>
    availableTimesByDate: Record<string, TimeSlot[]>
}

export const transformAppointments = (
    appointments: IAppointment[]
): TransformedAppointments => {
    const monthlyAvailability: Record<string, number> = {}
    const availableTimesByDate: Record<string, TimeSlot[]> = {}

    appointments.forEach((appointment) => {
        if (
            appointment.status === 'available'
        ) {
            const { dateKey, timeStr } = parseDateTime(appointment.startTime)

            // Count available slots per date
            monthlyAvailability[dateKey] =
                (monthlyAvailability[dateKey] || 0) + 1

            // Store available times for each date
            if (!availableTimesByDate[dateKey]) {
                availableTimesByDate[dateKey] = []
            }
            availableTimesByDate[dateKey].push({
                appointmentId: appointment._id,
                time: timeStr
            })
        }
    })

    return { monthlyAvailability, availableTimesByDate }
}
