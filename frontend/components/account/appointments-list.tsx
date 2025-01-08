'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentsTable } from './appointments-table'
import { IBooking } from '@/services/interfaces/IBooking'
import { useBooking } from '@/hooks/useBooking'
import { parseDateTime } from '@/lib/dateUtils'

interface Appointment {
    id: string
    date: string
    time: string
    service: string
}

const mapBookingToAppointment = (booking: IBooking): Appointment => {
    const { dateKey, timeStr } = parseDateTime(booking.startTime)
    return {
        id: booking._id,
        date: dateKey,
        time: timeStr,
        service: booking.clinicName
    }
}

export function AppointmentsList() {
    const { bookings, cancelBooking, loading, error } = useBooking()

    const handleCancel = async (id: string) => {
        const result = await cancelBooking(id)
        return result
    }

    if (loading) return <div>Loading your appointments...</div>
    if (error) return <div>Error: {error.message}</div>

    const appointments: Appointment[] = []
    for (const booking of bookings) {
        appointments.push(mapBookingToAppointment(booking))
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <AppointmentsTable
                        appointments={appointments}
                        onCancel={handleCancel}
                    />
                )}
            </CardContent>
        </Card>
    )
}
