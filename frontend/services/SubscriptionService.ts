import { MQTTService } from "./base/MQTTService";
import { ISubscriptionService, SubscriptionResponse } from "./interfaces/ISubscriptionService";
import { MQTT_TOPICS } from './base/MQTTService'
import {
    RequestResponseManager,
    RequestType
} from '@/lib/RequestResponseManager'

const { SUBSCRIPTION } = MQTT_TOPICS.NOTIFICATION

export class SubscriptionService implements ISubscriptionService {
    private client: MQTTService
    private requestManager: RequestResponseManager<SubscriptionResponse>

    constructor(client: MQTTService) {
        this.client = client
        this.requestManager = new RequestResponseManager<SubscriptionResponse>()
    }

    public async createSubscription(clinicId: string, patientId: string, date: Date): Promise<SubscriptionResponse> {
        try {
            const responseTopic = SUBSCRIPTION.CREATE.RESPONSE('')

            const response = await this.requestManager.request(
                SUBSCRIPTION.CREATE.REQUEST,
                responseTopic,
                { clinicId, patientId, date },
                this.client,
                RequestType.DIRECT
            )

            return response
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to create a subscription: ${error.message}`)
        }
    }

}