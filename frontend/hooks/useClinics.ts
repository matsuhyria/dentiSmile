import { useState, useEffect } from 'react'
import { IClinic } from '@/services/interfaces/IClinic'
import { ClinicService } from '@/services/ClinicService'
import mockClinicService from '@/services/mocks/mockClinicService'
import { useMQTTService } from './useMQTTService'

export const useClinics = () => {
    const { service: clinicService, error: serviceError } = useMQTTService(
        ClinicService,
        mockClinicService
    )

    const [clinics, setClinics] = useState<IClinic[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(serviceError)

    useEffect(() => {
        if (!clinicService) return

        const fetchClinics = async () => {
            try {
                const response = await clinicService.getClinics()
                setClinics(response.data)
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error('Failed to fetch clinics')
                )
            } finally {
                setLoading(false)
            }
        }

        fetchClinics()
    }, [clinicService])

    return { clinics, loading, error }
}
