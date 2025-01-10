'use client'
import { useState, useEffect } from 'react'
import { BookingService } from '@/services/BookingService'
import MockBookingService from '@/services/mocks/mockBookingService'
import { BookingResponse } from '@/services/interfaces/IBookingService'
import { useMQTTService } from './useMQTTService'
import { IAppointment } from '@/services/interfaces/IAppointment'

interface UseBookingReturn {
    requestAppointment: (
        appointmentId: string,
        patientId: string
    ) => Promise<{
        success: boolean
        data?: BookingResponse
        error?: string
    }>
    cancelBooking: (appointmentId: string) => Promise<{
        success: boolean
        data?: BookingResponse
        error?: string
    }>
    loading: boolean
    error: Error | null
    bookings: IAppointment[]
}

export const useBooking = (): UseBookingReturn => {
    const { service: bookingService, error: serviceError } = useMQTTService(
        BookingService,
        MockBookingService
    )
    const [bookings, setBookings] = useState<IAppointment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(serviceError)

    useEffect(() => {
        const fetchBookings = () => {
            const userId = localStorage.getItem('userId')

            if (!userId) {
                setError(new Error('UserId not found in local storage'))
                return
            }

            if (!bookingService) {
                setError(new Error('Booking service not initialized'))
                return
            }

            setLoading(true)
            const bookingsEmitter = bookingService.getBookings(userId)

            bookingsEmitter.on('data', (data: IAppointment[]) => {
                setBookings(data)
                setError(null)
                setLoading(false)
            })

            bookingsEmitter.on('error', (err: Error) => {
                setError(err)
                setLoading(false)
            })

            return () => {
                bookingsEmitter.removeAllListeners()
            }
        }

        fetchBookings()
    }, [bookingService])

    const requestAppointment = async (
        appointmentId: string,
        patientId: string
    ) => {
        if (!bookingService) {
            return { success: false, error: 'Booking service not initialized' }
        }

        setLoading(true)
        return new Promise<{
            success: boolean
            data?: BookingResponse
            error?: string
        }>((resolve) => {
            const emitter = bookingService.requestAppointment(
                appointmentId,
                patientId
            )

            const onData = (data: BookingResponse) => {
                resolve({ success: true, data })
                setLoading(false)
                emitter.removeListener('error', onError)
                emitter.removeListener('data', onData)
            }

            const onError = (err: Error) => {
                resolve({ success: false, error: err.message })
                setError(err)
                setLoading(false)
                emitter.removeListener('error', onError)
                emitter.removeListener('data', onData)
            }

            emitter.once('data', onData)
            emitter.once('error', onError)
        })
    }

    const cancelBooking = async (appointmentId: string) => {
        if (!bookingService) {
            setError(new Error('Booking service not initialized'))
            return { success: false, error: 'Booking service not initialized' }
        }

        setLoading(true)
        return new Promise<{
            success: boolean
            data?: BookingResponse
            error?: string
        }>((resolve) => {
            const emitter = bookingService.cancelBooking(appointmentId)

            const onData = (data: BookingResponse) => {
                setBookings((prev) =>
                    prev.filter((b) => b._id !== appointmentId)
                )
                resolve({ success: true, data })
                setLoading(false)
                emitter.removeListener('error', onError)
                emitter.removeListener('data', onData)
            }

            const onError = (err: Error) => {
                resolve({ success: false, error: err.message })
                setError(err)
                setLoading(false)
                emitter.removeListener('error', onError)
                emitter.removeListener('data', onData)
            }

            emitter.once('data', onData)
            emitter.once('error', onError)
        })
    }

    return {
        requestAppointment,
        cancelBooking,
        bookings,
        loading,
        error
    }
}
