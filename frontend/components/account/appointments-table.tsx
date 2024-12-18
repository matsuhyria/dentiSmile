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
    id: number
    date: string
    time: string
    service: string
}

interface AppointmentsTableProps {
    appointments: Appointment[]
}

export function AppointmentsTable({
    appointments: initialAppointments
}: AppointmentsTableProps) {
    const [appointments, setAppointments] = useState(initialAppointments)
    const [cancellingId, setCancellingId] = useState<number | null>(null)

    const handleCancel = async (id: number) => {
        setCancellingId(id)
        try {
            // TODO - Implement cancelAppointment function
            // const result = await cancelAppointment(id)
            // if (result.success) {
            //     setAppointments(
            //         appointments.filter((appointment) => appointment.id !== id)
            //     )
            //     toast({
            //         title: 'Appointment Cancelled',
            //         description: result.message
            //     })
            // }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to cancel appointment. Please try again.',
                variant: 'destructive'
            })
        } finally {
            setCancellingId(null)
        }
    }

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
