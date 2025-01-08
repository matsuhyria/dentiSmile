import { useState, useEffect, useMemo, useCallback } from 'react'
import { ClinicService } from '@/services/ClinicService'
import mockClinicService from '@/services/mocks/mockClinicService'
import { IAppointment } from '@/services/interfaces/IAppointment'
import { useMQTTService } from './useMQTTService'
import { transformAppointments } from '@/lib/appointmentUtils'
import { TimeSlot } from '@/lib/appointmentUtils'
import { toast } from 'sonner'
import { parseDateTime } from '@/lib/dateUtils'
import { EventEmitter } from 'events'

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
    lockAppointment: (
        appointmentId: string,
        patientId: string,
        clinicId: string
    ) => Promise<boolean>
    unlockAppointment: (appointmentId: string) => Promise<void>
    clearLock: () => void
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
    const [lockTimeout, setLockTimeout] = useState<NodeJS.Timeout>()
    const [lockedAppointmentId, setLockedAppointmentId] = useState<string>('')

    const [appointments, setAppointments] = useState<IAppointment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(serviceError)

    const { monthlyAvailability, availableTimesByDate } = useMemo(
        () => transformAppointments(appointments),
        [appointments]
    )

    const availableTimes = useMemo(() => {
        if (!selectedDate) return []

        // Convert to UTC to match the stored format
        const utcDate = new Date(
            Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            )
        )
        const { dateKey } = parseDateTime(utcDate)

        return availableTimesByDate[dateKey] || []
    }, [selectedDate, availableTimesByDate])

    const clinicName = useMemo(
        () => appointments[0]?.clinicName,
        [appointments]
    )

    useEffect(() => {
        if (!clinicService || !clinicId) return

        setLoading(true)
        const appointmentsEmitter: EventEmitter =
            clinicService.getClinicAppointments(
                clinicId,
                reasonId || '',
                date || ''
            )

        const onData = (data: IAppointment[]) => {
            setAppointments(data)
            setLoading(false)
        }

        const onError = (err: Error) => {
            setError(err)
            setLoading(false)
        }

        appointmentsEmitter.on('data', onData)
        appointmentsEmitter.on('error', onError)

        return () => {
            appointmentsEmitter.removeListener('data', onData)
            appointmentsEmitter.removeListener('error', onError)
        }
    }, [clinicService, clinicId, reasonId, date])

    const lockAppointment = async (
        appointmentId: string,
        patientId: string
    ): Promise<boolean> => {
        try {
            const response = await new Promise<{ success: boolean }>(
                (resolve, reject) => {
                    if (!clinicService) {
                        reject(new Error('Clinic service not initialized'))
                        return
                    }

                    const emitter = clinicService.lockAppointmentSlot(
                        appointmentId,
                        patientId,
                        clinicId
                    )

                    const onData = (data: { success: boolean }) => {
                        resolve(data)
                        cleanup()
                    }

                    const onError = (err: Error) => {
                        reject(err)
                        cleanup()
                    }

                    const cleanup = () => {
                        emitter.removeListener('data', onData)
                        emitter.removeListener('error', onError)
                    }

                    emitter.once('data', onData)
                    emitter.once('error', onError)
                }
            )

            if (response?.success) {
                setLockedAppointmentId(appointmentId)
                const timeout = setTimeout(() => {
                    unlockAppointment(appointmentId)
                }, 5 * 60 * 1000) // lock for 5 minutes
                setLockTimeout(timeout)
                return true
            }
        } catch (error) {
            console.error('Failed to reserve time slot:', error)
            toast.error('Failed to reserve this time slot. Please try another.')
        }
        return false
    }

    const unlockAppointment = useCallback(
        async (appointmentId: string) => {
            try {
                if (!clinicService)
                    throw new Error('Clinic service not initialized')
                await new Promise<void>((resolve, reject) => {
                    const emitter =
                        clinicService.unlockAppointmentSlot(appointmentId)

                    const onData = () => {
                        setLockedAppointmentId('')
                        resolve()
                        cleanup()
                    }

                    const onError = (err: Error) => {
                        console.error('Failed to unlock appointment:', err)
                        reject(err)
                        cleanup()
                    }

                    const cleanup = () => {
                        emitter.removeListener('data', onData)
                        emitter.removeListener('error', onError)
                    }

                    emitter.once('data', onData)
                    emitter.once('error', onError)
                })
            } catch (error) {
                console.error('Failed to unlock appointment:', error)
            }
        },
        [clinicService]
    )

    const clearLock = useCallback(() => {
        if (lockTimeout) {
            clearTimeout(lockTimeout)
        }
        if (lockedAppointmentId) {
            unlockAppointment(lockedAppointmentId)
        }
    }, [lockTimeout, lockedAppointmentId, unlockAppointment])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearLock()
        }
    }, [clearLock])

    return {
        clinicName,
        monthlyAvailability,
        availableTimes,
        loading,
        error,
        lockAppointment,
        unlockAppointment,
        clearLock
    }
}

export default useClinicAppointments
