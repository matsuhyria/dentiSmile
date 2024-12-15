import { IAppointment } from '@/services/interfaces/IAppointment'

export interface TransformedAppointments {
    monthlyAvailability: Record<string, number>
    availableTimesByDate: Record<string, string[]>
}

export const transformAppointments = (
    appointments: IAppointment[]
): TransformedAppointments => {
    const monthlyAvailability: Record<string, number> = {}
    const availableTimesByDate: Record<string, string[]> = {}

    appointments.forEach((appointment) => {
        if (appointment.status === 'available') {
            // Get date in YYYY-MM-DD format
            const dateKey = appointment.startTime.split('T')[0]

            // Count available slots per date
            monthlyAvailability[dateKey] =
                (monthlyAvailability[dateKey] || 0) + 1

            // Store available times for each date
            const timeStr = new Date(appointment.startTime).toLocaleTimeString(
                'en-US',
                {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }
            )

            if (!availableTimesByDate[dateKey]) {
                availableTimesByDate[dateKey] = []
            }
            availableTimesByDate[dateKey].push(timeStr)
        }
    })

    return { monthlyAvailability, availableTimesByDate }
}
