'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import useClinicAppointments from '@/hooks/useClinicAppointments'
import { useBooking } from '@/hooks/useBooking'
import ReasonSelection from '@/components/booking/ReasonSelection'
import DateTimeSelection from '@/components/booking/date-time/DateTimeSelection'
import Confirmation from '@/components/booking/Confirmation'
import { getAvailableReasons } from '@/lib/reasonStore'

export default function BookAppointmentPage({
    params
}: {
    params: { clinicId: string }
}) {
    const { clinicId } = params
    const [currentStep, setCurrentStep] = useState<
        'reason' | 'datetime' | 'confirmation'
    >('reason')
    const [reasonId, setReasonId] = useState<string>('')
    const [duration, setDuration] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<Date | null>(null)
    const [appointmentConfirmed, setAppointmentConfirmed] = useState(false)

    const { clinicName, monthlyAvailability, availableTimes } =
        useClinicAppointments({
            clinicId,
            reasonId,
            selectedDate
        })

    const { requestAppointment } = useBooking()

    const handleReasonSelect = (selectedReasonId: string) => {
        setReasonId(selectedReasonId)
        const reasons = getAvailableReasons()
        const chosenReason = reasons.find((r) => r.id === selectedReasonId)
        setDuration(chosenReason ? chosenReason.duration : 30)
        setCurrentStep('datetime')
    }

    const handleDateTimeSelect = (date: Date, time: Date) => {
        setSelectedDate(date)
        setSelectedTime(time)
        setCurrentStep('confirmation')
    }

    const handleConfirm = async () => {
        
        if (!reasonId || !selectedDate || !selectedTime || !duration) return

        const result = await requestAppointment({
            appointmentId: 'selectedTime.id',
            patientId: 'current-user-id'
        })

        if (result.success) {
            setAppointmentConfirmed(true)
        }
    }

    return (
        <div className="w-full mt-5 max-w-3xl mx-auto">
            <h1 className="my-4 text-2xl font-medium">
                Schedule Your Dental Appointment
            </h1>

            <div>
                <div className="border border-b-0 p-4 py-2 rounded-t-lg flex justify-between items-center text-gray-600 text-sm">
                    <p>{clinicName}</p>
                    <Button variant="ghost" asChild>
                        <Link href="/">Edit</Link>
                    </Button>
                </div>
                <ReasonSelection
                    isActive={currentStep === 'reason'}
                    onSelect={handleReasonSelect}
                    selectedReason={reasonId}
                    onEdit={() => {
                        setReasonId('')
                        setSelectedDate(null)
                        setSelectedTime(null)
                        setDuration(null)
                        setCurrentStep('reason')
                    }}
                />
                <DateTimeSelection
                    isActive={currentStep === 'datetime'}
                    onSelect={handleDateTimeSelect}
                    onEdit={() => setCurrentStep('datetime')}
                    clinicId={clinicId}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    setSelectedDate={setSelectedDate}
                    setSelectedTime={setSelectedTime}
                    appointmentDuration={duration || 30}
                    availableTimes={availableTimes}
                    monthlyAvailability={monthlyAvailability}
                />
                <Confirmation
                    isActive={currentStep === 'confirmation'}
                    reason={reasonId}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onConfirm={handleConfirm}
                    appointmentDuration={duration || 30}
                />
                {appointmentConfirmed && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
                        <h3 className="text-lg font-semibold">
                            Appointment Confirmed!
                        </h3>
                        <p>Your appointment has been successfully booked.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
