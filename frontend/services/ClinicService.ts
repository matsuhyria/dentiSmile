/* eslint-disable @typescript-eslint/no-explicit-any */
import { IClinicService } from './interfaces/IClinicService'
import { IAppointment } from './interfaces/IAppointment'
import { IClinic } from './interfaces/IClinic'
import { MQTT_TOPICS } from './base/MQTTService'
import { BaseClinicService } from './BaseClinicService'
import {
    RequestResponseManager,
    RequestType
} from '@/lib/RequestResponseManager'

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
                this.client,
                RequestType.BROADCAST
            )

            return { data }
        } catch (error) {
            throw new Error(`Failed to retrieve clinics: ${error.message}`)
        }
    }

    public async getClinicAppointments(
        clinicId: string,
        reasonId: string,
        date: string
    ): Promise<{ data: IAppointment[] }> {
        try {
            const data = await this.requestManager.request(
                MQTT_TOPICS.APPOINTMENT.CLINIC.RETRIEVE.REQUEST,
                MQTT_TOPICS.APPOINTMENT.CLINIC.RETRIEVE.RESPONSE(''),
                { clinicId, reasonId, date },
                this.client
            )

            return { data }
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
