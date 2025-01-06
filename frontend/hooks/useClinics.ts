import { useState, useEffect } from 'react'
import { IClinic } from '@/services/interfaces/IClinic'
import { ClinicService } from '@/services/ClinicService'
import mockClinicService from '@/services/mocks/mockClinicService'
import { useMQTTService } from './useMQTTService'
import { EventEmitter } from 'events'

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

        setLoading(true)
        const clinicsEmitter: EventEmitter = clinicService.getClinics()

        const onData = (data: IClinic[]) => {
            setClinics(data)
            setLoading(false)
        }

        const onError = (err: Error) => {
            setError(err)
            setLoading(false)
        }

        clinicsEmitter.on('data', onData)
        clinicsEmitter.on('error', onError)

        return () => {
            clinicsEmitter.removeListener('data', onData)
            clinicsEmitter.removeListener('error', onError)
        }
    }, [clinicService])

    return { clinics, loading, error }
}
