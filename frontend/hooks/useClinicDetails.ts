import { useState, useEffect } from 'react';
import { ClinicService } from '@/services/ClinicService';
import mockClinicService from '@/services/mocks/mockClinicService';
import { IClinicDetails } from '@/services/interfaces/IClinicDetails';
import { useMQTTService } from './useMQTTService';

interface UseClinicDetailsProps {
    clinicId: string;
    reasonId?: string;
    date?: string;
}

interface ClinicDetailsResponse {
    availability?: string[];
    details?: IClinicDetails;
}

export const useClinicDetails = ({
    clinicId,
    reasonId,
    date
}: UseClinicDetailsProps) => {
    const { service: clinicService, error: serviceError } = useMQTTService(
        ClinicService,
        mockClinicService
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(serviceError);
    const [data, setData] = useState<ClinicDetailsResponse | null>(null);

    useEffect(() => {
        if (!clinicService || !clinicId) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await clinicService.getClinicDetails(
                    clinicId,
                    reasonId || '',
                    date || ''
                );

                if (response.error) throw new Error(response.error);
                setData(response.data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error('Failed to fetch clinic details')
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [clinicService, clinicId, reasonId, date]);

    return {
        details: {
            details: data?.details ?? null,
            availability: data?.availability ?? []
        },
        loading,
        error
    };
};
