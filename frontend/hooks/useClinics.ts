import { useState, useEffect } from 'react';
import { ClinicService } from '@/services/ClinicService';
import mockClinicService from '@/services/mocks/mockClinicService';
import { IClinicDetails } from '@/services/interfaces/IClinicDetails';
import { subscribeClinics } from '@/lib/clinicStore';
import { useMQTTService } from './useMQTTService';

export const useClinics = () => {
    const { service: clinicService, error: serviceError } = useMQTTService(
        ClinicService,
        mockClinicService
    );
    const [clinics, setClinics] = useState<IClinicDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(serviceError);

    useEffect(() => {
        if (!clinicService) return;

        const fetchClinics = async () => {
            setLoading(true);

            try {
                const response = await clinicService.getClinics();

                setClinics(response?.data ?? []);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error('Failed to fetch clinics')
                );
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
        const unsubscribe = subscribeClinics(fetchClinics);
        return () => unsubscribe();
    }, [clinicService]);

    return { clinics, loading, error };
};
