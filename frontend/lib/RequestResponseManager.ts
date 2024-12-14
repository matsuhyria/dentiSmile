/* eslint-disable @typescript-eslint/no-explicit-any */
interface RequestResponse<T> {
    resolve: (value: T) => void
    reject: (error: Error) => void
    timeout?: NodeJS.Timeout
}

export class RequestResponseManager<T> {
    private requests = new Map<string, RequestResponse<T>>()
    private DEFAULT_TIMEOUT = 10000 // 10 seconds

    public async request(
        requestTopic: string,
        responseTopic: string,
        payload: any,
        client: any,
        timeout = this.DEFAULT_TIMEOUT
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const clientId = this.generateUniqueId()
            const requestPayload = { ...payload, clientId }

            // Setup timeout
            const timeoutHandler = setTimeout(() => {
                this.cleanup(clientId)
                reject(new Error('Request timed out'))
            }, timeout)

            // Store request details
            this.requests.set(clientId, {
                resolve,
                reject,
                timeout: timeoutHandler
            })

            // Subscribe to response topic
            client.subscribe(responseTopic, (err) => {
                if (err) {
                    this.cleanup(clientId)
                    reject(new Error(`Subscription error: ${err.message}`))
                }
            })

            // Publish request
            client.publish(requestTopic, JSON.stringify(requestPayload))

            // Setup message handler
            const messageHandler = (topic: string, message: Buffer) => {
                if (topic === responseTopic) {
                    try {
                        const response = JSON.parse(message.toString())

                        // if (response.clientId === clientId) { //TODO - uncomment this line when clientId is added to the response
                        this.handleResponse(clientId, response)
                        // }
                    } catch (error) {
                        this.cleanup(clientId)
                        reject(new Error('Invalid response format', error))
                    }
                }
            }

            client.on('message', messageHandler)
        })
    }

    private handleResponse(clientId: string, response: any) {
        const request = this.requests.get(clientId)
        if (request) {
            clearTimeout(request.timeout)
            if (response.status.code === 200) {
                request.resolve(response.data)
            } else {
                request.reject(new Error(response.error || 'Request failed'))
            }
            this.cleanup(clientId)
        }
    }

    private cleanup(clientId: string) {
        const request = this.requests.get(clientId)
        if (request) {
            clearTimeout(request.timeout)
            this.requests.delete(clientId)
        }
    }

    private generateUniqueId(): string {
        return Math.random().toString(36).substr(2, 9)
    }
}
