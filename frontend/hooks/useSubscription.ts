import { useState, useEffect, useCallback } from 'react';
import { SubscriptionService } from '@/services/SubscriptionService';
import { MQTTService } from '@/services/base/MQTTService';
import { SubscriptionResponse } from '@/services/interfaces/ISubscriptionService';
import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';

export function useSubscription() {
    const [notificationService, setNotificationService] = useState<ISubscriptionService | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionResponse, setSubscriptionResponse] = useState<SubscriptionResponse | null>(null);

    useEffect(() => {
        const initNotificationService = async () => {
            try {
                const client = await MQTTService.getClient()
                const service = new SubscriptionService(client)
                setNotificationService(service)
            } catch (error) {
                setError(`Failed to initialize notification service ${error}`);
            }
        }
        initNotificationService()
    }, []) // run once when component mounts

    const subscribeToDate = async (clinicId: string, patientId: string, date: Date) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await notificationService.createSubscription(clinicId, patientId, date);
            setSubscriptionResponse(response);
        } catch (error) {
            setError(`Error: ${error.message || 'An error occurred while subscribing to the date.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            // TO-DO:Cleanup logic
            console.log('Cleaning up NotificationService...');
        };
    }, [notificationService]);

    const resetResponse = useCallback(() => {
        setSubscriptionResponse(null);
    }, []);

    return {
        isLoading,
        error,
        subscriptionResponse,
        subscribeToDate,
        resetResponse
    };
}
