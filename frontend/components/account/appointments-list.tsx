'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentsTable } from './appointments-table'
import { IBooking } from '@/services/interfaces/IBooking';
import { useBooking } from '@/hooks/useBooking';

// copied interface
interface Appointment {
    id: number
    date: string
    time: string
    service: string
}

const mapBookingToAppointment = (booking: IBooking): Appointment => {
    const date = new Date(booking.startTime);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const formattedDate = date.toISOString().split('T')[0];

    return {
        id: parseInt(booking._id, 10),
        date: formattedDate,
        time: time,
        service: booking.clinicName,
    };
};

export function AppointmentsList() {
    const { bookings, loading, error } = useBooking();
    const appointments: Appointment[] = [];
    for (const booking of bookings) {
        appointments.push(mapBookingToAppointment(booking))
    }

    if (loading) return <div>Loading your appointments...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <AppointmentsTable appointments={appointments} />
                )}
            </CardContent>
        </Card>
    );
}