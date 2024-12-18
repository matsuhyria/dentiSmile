import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentsTable } from './appointments-table'

async function getAppointments() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
        {
            id: 1,
            date: '2023-06-15',
            time: '10:00 AM',
            service: 'Teeth Cleaning'
        },
        {
            id: 2,
            date: '2023-06-20',
            time: '2:00 PM',
            service: 'Regular Checkup'
        },
        {
            id: 3,
            date: '2023-06-25',
            time: '11:30 AM',
            service: 'Cosmetic Consultation'
        }
    ]
}

export async function AppointmentsList() {
    const appointments = await getAppointments()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                <AppointmentsTable appointments={appointments} />
            </CardContent>
        </Card>
    )
}
