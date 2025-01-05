'use client'

import { Button } from '@/components/ui/button'
import DateSelection from './DateSelection'
import TimeSelection from './TimeSelection'
import { Alert } from '@/components/ui/alert'
import { TimeSlot } from '@/lib/appointmentUtils'
import AppointmentSubscription from '@/components/notification/appointmentSubscription'

interface DateTimeSelectionProps {
    onEdit: () => void
    onSelect: (date: Date, time: Date, appointmentId: string) => void
    isActive: boolean
    clinicId: string
    appointmentDuration: number
    selectedDate: Date | null
    selectedTime: Date | null
    setSelectedDate: (date: Date | null) => void
    setSelectedTime: (time: Date | null) => void
    availableTimes: TimeSlot[]
    monthlyAvailability: Record<string, number>
}

export default function DateTimeSelection({
    isActive,
    appointmentDuration,
    setSelectedDate,
    setSelectedTime,
    onEdit,
    onSelect,
    selectedDate,
    selectedTime,
    clinicId,
    availableTimes,
    monthlyAvailability
}: DateTimeSelectionProps) {
    // If we're not active and we don't have a fully selected date/time, don't render anything.
    if (!isActive && (!selectedDate || !selectedTime)) return null

    const handleTimeSelected = (time: Date, appointmentId: string) => {
        setSelectedTime(time)
        if (selectedDate && time) {
            const finalDateTime = new Date(selectedDate)
            finalDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0)
            onSelect(finalDateTime, time, appointmentId)
        }
    }

    // If step is active, show the date/time selection UI
    if (isActive) {
        return (
            <div className="border p-4 rounded-b-lg">
                <h3 className="text-lg mb-2 font-semibold">
                    Which date and time is best?
                </h3>

                <DateSelection
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                    clinicId={clinicId}
                    monthlyAvailability={monthlyAvailability}
                />

                {selectedDate && availableTimes.length > 0 && (
                    <TimeSelection
                        setSelectedTime={handleTimeSelected}
                        selectedTime={selectedTime}
                        clinicId={clinicId}
                        appointmentDuration={appointmentDuration}
                        availableTimes={availableTimes}
                    />
                )}

                {selectedDate && availableTimes.length === 0 && (
                    <>
                        <Alert className="mt-8 bg-sky-100">
                            <p className="text-sm text-gray-600">
                                No available times on this date.
                            </p>
                        </Alert>
                        <div className="mt-6">
                            <AppointmentSubscription
                                clinicId={clinicId}
                                patientId={localStorage.getItem('userId')}
                                date={selectedDate}
                            />
                        </div>
                    </>
                )}
            </div>
        )
    }

    // If we reach here, the step is not active and we have a selected date/time, so show a summary
    return (
        <div className="border p-4 border-b-0 py-2">
            <div className="flex justify-between items-center text-gray-600 text-sm">
                <p>
                    {selectedDate?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    ,{' '}
                    {selectedTime?.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: false
                    })}
                </p>
                <Button variant="ghost" onClick={onEdit}>
                    Edit
                </Button>
            </div>
        </div>
    )
}
