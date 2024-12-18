/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Appointment {
    id: string
    date: string
    time: string
    service: string
}

interface AppointmentsTableProps {
    appointments: Appointment[]
    onCancel: (id: string) => Promise<{ success: boolean; message?: string }>
}

export function AppointmentsTable({
    appointments: initialAppointments,
    onCancel
}: AppointmentsTableProps) {
    const [appointments, setAppointments] = useState(initialAppointments)
    const [cancellingId, setCancellingId] = useState<string | null>(null)

    const handleCancel = async (id: string) => {
        setCancellingId(id);
        try {
            const result = await onCancel(id);
            if (result.success) {
                toast.message('Appointment Cancelled', {
                    description: result.message || 'The appointment was successfully cancelled.'
                });
            } else {
                throw new Error(result.message || 'Cancellation failed.');
            }
        } catch (error) {
            toast.error('Failed to cancel appointment. Please try again.');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancel(appointment.id)}
                                disabled={cancellingId === appointment.id}
                            >
                                {cancellingId === appointment.id
                                    ? 'Cancelling...'
                                    : 'Cancel'}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
