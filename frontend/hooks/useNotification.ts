import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@/services/NotificationService';
import { INotificationService, Message } from '@/services/interfaces/INotificationService';
import { MQTTService } from '@/services/base/MQTTService';

export function useNotification(patientId: string) {
    const [notificationService, setNotificationService] = useState<INotificationService | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        const service = new NotificationService(patientId);
        setNotificationService(service);
    }, [patientId]); // recreate if patientId changes

    useEffect(() => {
        if (notificationService) {
            const handleNewNotification = (message: Message) => {
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    message.notification
                ]);
            };

            const subscribeToNotifications = async () => {
                setIsLoading(true);
                setError(null);

                try {
                    await MQTTService.getClient();
                    await notificationService.subscribeForAvailabilityNotifications(handleNewNotification);
                    await notificationService.subscribeForAppointmentCancellationNotifications(handleNewNotification);
                } catch (error) {
                    setError(`Error subscribing to notifications: ${error.message}`);
                } finally {
                    setIsLoading(false);
                }
            };

            subscribeToNotifications();

            return () => {
                if (notificationService) {
                    notificationService.unsubscribeFromAllNotifications();
                    console.log('Cleaning up notification service')
                }
            };
        }
    }, [notificationService]);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        isLoading,
        error,
        notifications,
        clearNotifications,
    };
}
