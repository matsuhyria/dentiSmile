import { EventEmitter } from 'events'

export interface NotificationMessage {
    notification: string;
    type: 'availability' | 'cancellation';
    timestamp: Date;
}

export interface INotificationService {
    subscribeToNotifications(): EventEmitter;
    disconnect(): Promise<void>;
}
