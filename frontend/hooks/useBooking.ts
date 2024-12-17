import { useState } from 'react'
import { BookingService } from '@/services/BookingService'
import MockBookingService from '@/services/mocks/mockBookingService'
import { BookingResponse } from '@/services/interfaces/IBookingService'
import { useMQTTService } from './useMQTTService'

interface UseBookingReturn {
    requestAppointment: (
        appointmentId: string,
        patientId: string
    ) => Promise<{
        success: boolean
        data?: BookingResponse
        error?: string
    }>
    loading: boolean
    error: Error | null
}

export const useBooking = (): UseBookingReturn => {
    const { service: bookingService, error: serviceError } = useMQTTService(
        BookingService,
        MockBookingService
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(serviceError)

    const requestAppointment = async (
        appointmentId: string,
        patientId: string
    ) => {
        if (!bookingService) {
            return { success: false, error: 'Booking service not initialized' }
        }

        setLoading(true)
        try {
            const response = await bookingService.requestAppointment(
                appointmentId,
                patientId
            )

            if (response.error) {
                throw new Error(response.error)
            }

            return {
                success: true,
                data: response
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to book appointment'
            setError(new Error(errorMessage))
            return {
                success: false,
                error: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        requestAppointment,
        loading,
        error
    }
}
