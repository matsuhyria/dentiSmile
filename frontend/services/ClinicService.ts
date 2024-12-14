/* eslint-disable @typescript-eslint/no-explicit-any */
import { IClinicService } from './interfaces/IClinicService'
import { MQTT_TOPICS } from './base/MQTTService'
import { BaseClinicService } from './BaseClinicService'
import { RequestResponseManager } from '@/lib/RequestResponseManager'
import { IClinic } from './interfaces/IClinic'
import { IClinicDetails } from './interfaces/IClinicDetails'

export class ClinicService extends BaseClinicService implements IClinicService {
    protected requestManager: RequestResponseManager<any>

    constructor(client: any) {
        super(client)
        this.requestManager = new RequestResponseManager()

        if (!client || typeof client.on !== 'function') {
            throw new Error('Invalid MQTT client provided')
        }
    }

    public async getClinics(): Promise<{ data: IClinic[] }> {
        try {
            const data = await this.requestManager.request(
                MQTT_TOPICS.CLINIC.RETRIEVE.MANY.REQUEST,
                MQTT_TOPICS.CLINIC.RETRIEVE.MANY.RESPONSE(),
                {}, // Empty payload
                this.client
            )

            return { data }
        } catch (error) {
            throw new Error(`Failed to retrieve clinics: ${error.message}`)
        }
    }

    public async getClinicDetails(
        clinicId: string,
        reasonId: string,
        date: string
    ): Promise<{ data: IClinicDetails }> {
        try {
            const data = await this.requestManager.request(
                MQTT_TOPICS.CLINICS.DETAILS.REQUEST,
                MQTT_TOPICS.CLINICS.DETAILS.RESPONSE,
                { clinicId, reasonId, date },
                this.client
            )

            return data
        } catch (error) {
            throw new Error(
                `Failed to retrieve clinic details: ${error.message}`
            )
        }
    }

    public async disconnect(): Promise<void> {
        // Implement actual disconnect logic if needed
        return Promise.resolve()
    }
}
