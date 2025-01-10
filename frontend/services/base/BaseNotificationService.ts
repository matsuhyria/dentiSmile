/* eslint-disable @typescript-eslint/no-explicit-any */
import { INotificationService } from '../interfaces/INotificationService'
import { RequestResponseManager } from '@/lib/RequestResponseManager'
import { EventEmitter } from 'events'
import { MqttClient } from 'mqtt'

export abstract class BaseNotificationService implements INotificationService {
    protected client: MqttClient
    protected requestManager: RequestResponseManager<any>

    constructor(client: MqttClient) {
        this.client = client
        this.requestManager = new RequestResponseManager()

        if (!client || typeof client.on !== 'function') {
            throw new Error('Invalid MQTT client provided')
        }
    }

    public abstract subscribeToNotifications(): EventEmitter

    public async disconnect(): Promise<void> {
        try {
            this.requestManager.unsubscribeAll(this.client)
            if (this.client.connected) {
                await new Promise<void>((resolve) => {
                    this.client.end(false, {}, () => resolve())
                })
            }
        } catch (error) {
            throw new Error(`Failed to disconnect: ${error.message}`)
        }
    }
}
