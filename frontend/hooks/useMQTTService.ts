import { useState, useEffect } from 'react';
import { MQTTService } from '@/services/base/MQTTService';

export const useMQTTService = (ServiceClass, MockServiceClass) => {
    const isDevMode = process.env.NODE_ENV === 'development';
    const [service, setService] = useState<typeof ServiceClass | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initializeService = async () => {
            try {
                if (isDevMode) {
                    setService(new MockServiceClass());
                } else {
                    const client = await MQTTService.getClient();
                    setService(new ServiceClass(client));
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error('Failed to initialize service')
                );
            }
        };
        initializeService();
    }, [ServiceClass, MockServiceClass, isDevMode]);

    return { service, error };
};
