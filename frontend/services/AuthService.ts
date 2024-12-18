/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAuthService } from './interfaces/IAuthService'
import {
    RequestResponseManager,
    RequestType
} from '@/lib/RequestResponseManager'
import { MQTT_TOPICS } from './base/MQTTService'

const { AUTHENTICATION } = MQTT_TOPICS

export interface AuthData {
    token: string
    userId: string
}
export class AuthService implements IAuthService {
    private client: any
    private requestManager: RequestResponseManager<any>

    constructor(client: any) {
        this.client = client
        this.requestManager = new RequestResponseManager<any>()
    }

    public async register(email: string, password: string): Promise<AuthData> {
        try {
            const responseTopic = AUTHENTICATION.REGISTER.RESPONSE('')

            const response = await this.requestManager.request(
                AUTHENTICATION.REGISTER.REQUEST,
                responseTopic,
                { email, password },
                this.client,
                RequestType.DIRECT
            )

            return response
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to register: ${error.message}`)
        }
    }

    public async login(email: string, password: string): Promise<AuthData> {
        try {
            // remove undefined
            let responseTopic = AUTHENTICATION.LOGIN.RESPONSE('')
            const remove = 'undefined'
            responseTopic = responseTopic.substring(
                0,
                responseTopic.length - remove.length
            )

            const response = await this.requestManager.request(
                AUTHENTICATION.LOGIN.REQUEST,
                responseTopic,
                { email, password },
                this.client,
                RequestType.DIRECT
            )

            return response
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to login: ${error.message}`)
        }
    }

    public disconnect(): Promise<void> {
        return Promise.resolve()
    }
}
