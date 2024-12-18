/* eslint-disable @typescript-eslint/no-explicit-any */
export enum RequestType {
    BROADCAST = 'broadcast',
    DIRECT = 'direct'
}

interface RequestResponse<T> {
    resolve: (value: T) => void
    reject: (error: Error) => void
    timeout?: NodeJS.Timeout
    type: RequestType
}

export class RequestResponseManager<T> {
    private requests = new Map<string, RequestResponse<T>>()
    private DEFAULT_TIMEOUT = 10000
    private broadcastSubscriptions = new Set<string>()

    public async request(
        requestTopic: string,
        responseTopic: string,
        payload: any,
        client: any,
        type: RequestType = RequestType.DIRECT,
        timeout = this.DEFAULT_TIMEOUT
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const clientId = this.generateUniqueId()
            const requestPayload = { ...payload, clientId }

            const timeoutHandler =
                type === RequestType.DIRECT
                    ? setTimeout(() => {
                        this.cleanup(clientId, client)
                        reject(new Error('Request timed out'))
                    }, timeout)
                    : undefined

            // Store request details
            this.requests.set(clientId, {
                resolve,
                reject,
                timeout: timeoutHandler,
                type
            })

            // Handle subscription based on type

            const topicToSubscribe =
                type === RequestType.BROADCAST
                    ? responseTopic
                    : responseTopic + clientId

            console.log('TOPIC:', topicToSubscribe);

            if (
                type === RequestType.BROADCAST &&
                this.broadcastSubscriptions.has(topicToSubscribe)
            ) {
                // Already subscribed to broadcast topic
                client.publish(requestTopic, JSON.stringify(requestPayload))
                return
            }

            client.subscribe(topicToSubscribe, (err: Error) => {
                if (err) {
                    this.cleanup(clientId, client)
                    reject(new Error(`Subscription error: ${err.message}`))
                    return
                }

                if (type === RequestType.BROADCAST) {
                    this.broadcastSubscriptions.add(topicToSubscribe)
                }

                // Publish request
                client.publish(requestTopic, JSON.stringify(requestPayload))
            })

            // Setup message handler
            const messageHandler = (topic: string, message: Buffer) => {
                try {
                    const response = JSON.parse(message.toString())

                    if (topic === topicToSubscribe) {
                        this.handleResponse(clientId, response, client, type)
                    }
                } catch (error) {
                    if (type === RequestType.DIRECT) {
                        this.cleanup(clientId, client)
                        reject(new Error('Invalid response format', error))
                    }
                }
            }

            client.on('message', messageHandler)
        })
    }

    private handleResponse(
        clientId: string,
        response: any,
        client: any,
        type: RequestType
    ) {
        const request = this.requests.get(clientId)
        if (request) {
            if (type === RequestType.DIRECT) {
                clearTimeout(request.timeout)
                if (response.status?.code === 200) {
                    request.resolve(response.data || response)
                } else {
                    request.reject(
                        new Error(response.status?.message || 'Request failed')
                    )
                }
                this.cleanup(clientId, client)
            } else {
                // For broadcast, just resolve with data and keep subscription
                request.resolve(response.data || response)
            }
        }
    }

    private cleanup(clientId: string, client: any) {
        const request = this.requests.get(clientId)
        if (request) {
            if (request.type === RequestType.DIRECT) {
                clearTimeout(request.timeout)
                client.unsubscribe(clientId)
            }
            this.requests.delete(clientId)
        }
    }

    public unsubscribeAll(client: any) {
        // Clean up all subscriptions when component unmounts
        this.broadcastSubscriptions.forEach((topic) => {
            client.unsubscribe(topic)
        })
        this.broadcastSubscriptions.clear()
    }

    private generateUniqueId(): string {
        return Math.random().toString(36).slice(2, 9)
    }
}
