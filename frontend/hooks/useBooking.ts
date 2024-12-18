'use client'
import { useState, useEffect } from 'react'
import { BookingService } from '@/services/BookingService'
import { IBooking } from '@/services/interfaces/IBooking'
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
    bookings: IBooking[];
}

export const useBooking = (): UseBookingReturn => {
    const { service: bookingService, error: serviceError } = useMQTTService(
        BookingService,
        MockBookingService
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(serviceError)
    const [bookings, setBookings] = useState<IBooking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError(new Error('UserId not found in local storage'));
                return;
            }

            if (!bookingService) {
                setError(new Error('Booking service not initialized'));
                return;
            }

            setLoading(true);
            try {
                const response = await bookingService.getBookings(userId);
                setBookings(response.data);
                setError(null);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Failed to retrieve bookings';
                setError(new Error(errorMessage));
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [bookingService]);

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
        bookings,
        loading,
        error
    }
}
