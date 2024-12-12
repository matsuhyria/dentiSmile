/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBookingService } from './interfaces/IBookingService';
import { MQTT_TOPICS } from './base/MQTTService';

interface BookingResponse {
    attemptId: string;
    success: boolean;
    error?: string;
    data?: any;
}

export class BookingService implements IBookingService {
    private client: any;
    private bookingCallbacks = new Map<string, (result: BookingResponse) => void>();

    constructor(client: any) {
        if (!client || typeof client.on !== 'function') {
            throw new Error('Invalid MQTT client provided');
        }
        this.client = client;
        this.setupSubscriptions();
    }

    protected setupSubscriptions() {
        try {
            this.client.on('message', (topic: string, message: Buffer) => {
                if (topic === MQTT_TOPICS.APPOINTMENT.BOOK.RESPONSE()) {
                    const response = JSON.parse(message.toString()) as BookingResponse;
                    const callback = this.bookingCallbacks.get(response.attemptId);
                    if (callback) {
                        callback(response);
                        this.bookingCallbacks.delete(response.attemptId);
                    }
                }
            });

            this.client.subscribe(MQTT_TOPICS.APPOINTMENT.BOOK.RESPONSE(), (err) => {
                if (err) {
                    console.error('Failed to subscribe to booking response:', err);
                }
            });
        } catch (error) {
            console.error('Error setting up MQTT subscriptions:', error);
            throw error;
        }
    }

    public async requestAppointment(
        clinicId: string,
        reasonId: string,
        date: string,
        slot: string
    ): Promise<{ error?: string; data?: any }> {
        return new Promise((resolve) => {
            const attemptId = Math.random().toString(36);
            this.bookingCallbacks.set(attemptId, resolve);

            this.client.publish(MQTT_TOPICS.APPOINTMENT.BOOK.REQUEST, {
                clinicId,
                reasonId,
                date,
                slot,
                attemptId
            });
        });
    }

    public async disconnect(): Promise<void> {
        return Promise.resolve();
    }
}
