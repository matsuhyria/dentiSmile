/* eslint-disable @typescript-eslint/no-explicit-any */
import { IClinicService } from './interfaces/IClinicService';
import { MQTT_TOPICS } from './base/MQTTService';
import { BaseClinicService } from './BaseClinicService';

interface ClinicResponse {
    attemptId: string;
    success: boolean;
    error?: string;
    data?: any;
}

export class ClinicService extends BaseClinicService implements IClinicService {
    protected client: any; // or public, depending on BaseClinicService
    protected detailsCallbacks = new Map<string, (result: ClinicResponse) => void>();

    constructor(client: any) {
        super(client);
        if (!client || typeof client.on !== 'function') {
            throw new Error('Invalid MQTT client provided');
        }
        this.client = client;
        this.setupSubscriptions();
    }

    protected setupSubscriptions() {
        try {
            this.client.on('message', (topic: string, message: Buffer) => {
                if (topic === MQTT_TOPICS.CLINICS.DETAILS.RESPONSE) {
                    const response = JSON.parse(
                        message.toString()
                    ) as ClinicResponse;
                    const callback = this.detailsCallbacks.get(
                        response.attemptId
                    );
                    if (callback) {
                        callback(response);
                        this.detailsCallbacks.delete(response.attemptId);
                    }
                }
            });

            this.client.subscribe(
                MQTT_TOPICS.CLINICS.DETAILS.RESPONSE,
                (err) => {
                    if (err) {
                        console.error(
                            'Failed to subscribe to clinic details:',
                            err
                        );
                    }
                }
            );
        } catch (error) {
            console.error('Error setting up MQTT subscriptions:', error);
            throw error;
        }
    }

    public async getClinics(): Promise<{ error?: string; data?: any }> {
        return new Promise((resolve) => {
            this.client.publish(
                MQTT_TOPICS.CLINICS.DETAILS.REQUEST,
                null,
                resolve
            );
        });
    }

    public async getClinicDetails(
        clinicId: string,
        reasonId: string,
        date: string
    ): Promise<{ error?: string; data?: any }> {
        return new Promise((resolve) => {
            const attemptId = Math.random().toString(36);
            this.detailsCallbacks.set(attemptId, resolve);

            this.client.publish(MQTT_TOPICS.CLINICS.DETAILS.REQUEST, {
                clinicId,
                reasonId,
                date,
                attemptId
            });
        });
    }

    public async disconnect(): Promise<void> {
        return Promise.resolve();
    }
}
