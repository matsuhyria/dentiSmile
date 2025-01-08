export interface Message {
    notification: string;
}

export interface INotificationService {
    subscribeForAvailabilityNotifications(callback: (message: Message) => void): Promise<void>
    subscribeForAppointmentCancellationNotifications(callback: (message: Message) => void): Promise<void>
    unsubscribeFromAllNotifications(): Promise<void>
}