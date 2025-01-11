'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentsTable } from './appointments-table'
import { useBooking } from '@/hooks/useBooking'


export function AppointmentsList() {
    const { bookings, cancelBooking, error } = useBooking()

    const handleCancel = async (id: string) => {
        const result = await cancelBooking(id)
        return result
    }

    if (error) return <div>Error: {error.message}</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                {bookings.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <AppointmentsTable
                        appointments={bookings}
                        onCancel={handleCancel}
                    />
                )}
            </CardContent>
        </Card>
    )
}
