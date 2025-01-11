/* eslint-disable @typescript-eslint/no-explicit-any */
import { MqttClient } from 'mqtt'
import { generateUniqueId } from './utils'
import { EventEmitter } from 'events'

export enum RequestType {
    BROADCAST = 'broadcast',
    DIRECT = 'direct'
}

interface RequestResponse<T> {
    emitter: EventEmitter
    timeout?: NodeJS.Timeout
    type: RequestType
    data?: T
}

export class RequestResponseManager<T> {
    private requests = new Map<string, RequestResponse<T>>()
    private DEFAULT_TIMEOUT = 10000
    private broadcastSubscriptions = new Set<string>()

    public request(
        requestTopic: string,
        responseTopic: string,
        payload: any,
        client: MqttClient,
        type: RequestType = RequestType.DIRECT,
        timeout = this.DEFAULT_TIMEOUT
    ): EventEmitter {
        const clientId = generateUniqueId()
        const emitter = new EventEmitter()
        const requestPayload =
            type === RequestType.DIRECT ? { ...payload, clientId } : payload
        
        const timeoutHandler =
            type === RequestType.DIRECT
                ? setTimeout(() => {
                      this.cleanup(clientId, client)
                      emitter.emit('error', new Error('Request timed out'))
                  }, timeout)
                : undefined

        this.requests.set(clientId, {
            emitter,
            timeout: timeoutHandler,
            type
        })

        const topicToSubscribe =
            type === RequestType.BROADCAST
                ? responseTopic
                : responseTopic + clientId

        if (
            type === RequestType.BROADCAST &&
            this.broadcastSubscriptions.has(topicToSubscribe)
        ) {
            client.publish(requestTopic, JSON.stringify(requestPayload))
            return emitter
        }

        const messageHandler = (topic: string, message: Buffer) => {
            if (topic !== topicToSubscribe) return

            try {
                const response = JSON.parse(message.toString())
                if (type === RequestType.DIRECT) {
                    if (response.status?.code === 200) {
                        emitter.emit('data', response.data || response)
                        this.cleanup(clientId, client)
                    } else {
                        emitter.emit(
                            'error',
                            new Error(
                                response.status?.message || 'Request failed'
                            )
                        )
                        this.cleanup(clientId, client)
                    }
                } else {
                    emitter.emit('data', response.data || response)
                }
            } catch {
                emitter.emit('error', new Error('Invalid response format'))
                if (type === RequestType.DIRECT) {
                    this.cleanup(clientId, client)
                }
            }
        }

        client.on('message', messageHandler)

        client.subscribe(topicToSubscribe, (err) => {
            if (err) {
                emitter.emit(
                    'error',
                    new Error(`Subscription error: ${err.message}`)
                )
                this.cleanup(clientId, client)
                return
            }

            if (type === RequestType.BROADCAST) {
                this.broadcastSubscriptions.add(topicToSubscribe)
            }

            client.publish(requestTopic, JSON.stringify(requestPayload))
        })

        return emitter
    }

    private cleanup(clientId: string, client: MqttClient) {
        const request = this.requests.get(clientId)
        if (request) {
            if (request.type === RequestType.DIRECT) {
                clearTimeout(request.timeout)
                client.unsubscribe(clientId)
            }
            this.requests.delete(clientId)
        }
    }

    public unsubscribeAll(client: MqttClient) {
        // Clean up all subscriptions when component unmounts
        this.broadcastSubscriptions.forEach((topic) => {
            client.unsubscribe(topic)
        })
        this.broadcastSubscriptions.clear()
    }
}
