// hooks/useBooking.ts
import { useState } from 'react';
import { BookingService } from '@/services/BookingService';
import { mockBookingService } from '@/services/mocks/mockBookingService';
import { useMQTTService } from './useMQTTService';

interface BookingRequest {
    clinicId: string;
    reasonId: string;
    date: string;
    slot: string;
}

interface BookingResponse {
    success: boolean;
    error?: string;
    data?: {
        appointmentId: string;
        dateTime: string;
        status: 'confirmed' | 'pending' | 'rejected';
    };
}

export const useBooking = () => {
    const { service: bookingService, error: serviceError } = useMQTTService(
        BookingService,
        mockBookingService
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(serviceError);

    const requestAppointment = async (
        request: BookingRequest
    ): Promise<BookingResponse> => {
        if (!bookingService) {
            return { success: false, error: 'Booking service not initialized' };
        }

        setLoading(true);
        try {
            const response = await bookingService.requestAppointment(
                request.clinicId,
                request.reasonId,
                request.date,
                request.slot
            );

            if (response.error) {
                throw new Error(response.error);
            }

            return {
                success: true,
                data: response.data
            };
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to book appointment';
            setError(new Error(errorMessage));
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        requestAppointment,
        loading,
        error
    };
};
