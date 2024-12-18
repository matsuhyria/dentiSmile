import { useState, useEffect, useMemo } from 'react'
import { ClinicService } from '@/services/ClinicService'
import mockClinicService from '@/services/mocks/mockClinicService'
import { IAppointment } from '@/services/interfaces/IAppointment'
import { useMQTTService } from './useMQTTService'
import { transformAppointments } from '@/lib/appointmentUtils'
import { TimeSlot } from '@/lib/appointmentUtils'

interface UseClinicAppointmentsProps {
    clinicId: string
    reasonId?: string
    date?: string
    selectedDate?: Date | null
}

interface UseClinicAppointmentsReturn {
    clinicName: string | undefined
    monthlyAvailability: Record<string, number>
    availableTimes: TimeSlot[]
    loading: boolean
    error: Error | null
}

export const useClinicAppointments = ({
    clinicId,
    reasonId,
    date,
    selectedDate
}: UseClinicAppointmentsProps): UseClinicAppointmentsReturn => {
    const { service: clinicService, error: serviceError } = useMQTTService(
        ClinicService,
        mockClinicService
    )

    const [appointments, setAppointments] = useState<IAppointment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(serviceError)

    const { monthlyAvailability, availableTimesByDate } = useMemo(
        () => transformAppointments(appointments),
        [appointments]
    )

    const availableTimes = useMemo(() => {
        if (!selectedDate) return []
        // ACHTUNG!
        // DATE KEY IS OFF BY MINUS ONE DAY
        const dateKey = selectedDate.toISOString().split('T')[0]
        return availableTimesByDate[dateKey] || []
    }, [selectedDate, availableTimesByDate])

    const clinicName = useMemo(
        () => appointments[0]?.clinicName,
        [appointments]
    )

    useEffect(() => {
        if (!clinicService || !clinicId) return

        const fetchAppointments = async () => {
            try {
                const response = await clinicService.getClinicAppointments(
                    clinicId,
                    reasonId || '',
                    date || ''
                )
                setAppointments(response.data || [])
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error('Failed to fetch clinic appointments')
                )
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [clinicService, clinicId, reasonId, date])

    return {
        clinicName,
        monthlyAvailability,
        availableTimes,
        loading,
        error
    }
}

export default useClinicAppointments
