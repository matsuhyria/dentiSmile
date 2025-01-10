import mqtt from 'mqtt'

let client = null

export const connectMQTT = async (MQTT_URI, options = {}) => {
    if (client) {
        return client
    }
    try {
        client = await mqtt.connectAsync(MQTT_URI, options)

        console.log(`Connected to MQTT Broker at ${MQTT_URI}`)

        client.on('error', (err) => {
            console.error('MQTT connection error:', err)
            client.end()
        })

        client.on('reconnect', () => {
            console.log('Reconnecting to MQTT Broker...')
        })

        client.on('offline', () => {
            console.log('MQTT Client is offline')
        })
        return client
    } catch (error) {
        console.error('Error connecting MQTT', error)
        throw error
    }
}

export const publish = async (topic, message, options = {}) => {
    if (!client) {
        throw new Error('MQTT client not connected')
    }
    try {
        await client.publishAsync(topic, JSON.stringify(message), options)
        console.log(`Message published to topic "${topic}": ${message}`)
    } catch (error) {
        console.error(`Error publishing to topic "${topic}":`, error)
        throw error
    }
}

export const subscribe = async (topic, callback, options = {}) => {
    if (!client) {
        throw new Error('MQTT client not connected')
    }
    try {
        await client.subscribeAsync(topic, options)
        console.log(`Subscribed to topic "${topic}"`)

        client.on('message', (receivedTopic, message) => {
            if (receivedTopic === topic) {
                callback(JSON.parse(message.toString()))
            }
        })
    } catch (error) {
        console.error(`Error subscribing to topic "${topic}":`, error)
        throw error
    }
}

export const subscribeShared = async (
    groupName,
    topic,
    callback,
    options = {}
) => {
    if (!client) throw new Error('MQTT client not connected')
    try {
        const sharedTopic = `$shared/${groupName}/${topic}`
        await client.subscribeAsync(sharedTopic, options)
        console.log(`Subscribed to shared topic "${sharedTopic}"`)

        client.on('message', (receivedTopic, message) => {
            if (receivedTopic === sharedTopic) {
                try {
                    const parsedMessage = JSON.parse(message.toString())
                    callback(parsedMessage)
                } catch (error) {
                    console.error(
                        `Failed to process message on topic "${receivedTopic}":`,
                        error
                    )
                }
            }
        })
    } catch (error) {
        console.error(
            `Failed to process message on topic "${receivedTopic}":`,
            error
        )
        throw error
    }
}

export const unsubscribe = async (topic) => {
    if (!client) {
        throw new Error('MQTT client not connected')
    }
    try {
        await client.unsubscribeAsync(topic)
        console.log(`Unsubscribed from topic "${topic}"`)
    } catch (error) {
        console.error(`Error unsubscribing from topic "${topic}":`, error)
        throw error
    }
}

export const disconnectMQTT = async (options = {}) => {
    try {
        await client.endAsync(options)
        console.log('MQTT client disconnected')
    } catch (error) {
        console.error('Error disconnecting MQTT client:', error)
        throw error
    }
}

export const handleEndpoint = async (
    requestTopic,
    callback,
    responseTopic,
    options = {}
) => {
    if (!client) {
        throw new Error('MQTT client not connected')
    }
    try {
        await client.subscribeAsync(requestTopic, options)
        console.log(`Subscribed to topic "${requestTopic}"`)

        client.on('message', async (receivedTopic, message) => {
            if (receivedTopic === requestTopic) {
                let parsedMessage
                try {
                    parsedMessage = JSON.parse(message.toString())
                } catch (parseError) {
                    console.error(
                        `Invalid JSON payload received: ${message.toString()}`,
                        parseError
                    )
                    return
                }

                const { clientId } = JSON.parse(message.toString())
                const dynamicResponseTopic = responseTopic(clientId)
                const response = await callback(message.toString())
                await publish(dynamicResponseTopic, response, options)
            }
        })
    } catch (error) {
        console.error(`Error subscribing to topic "${requestTopic}":`, error)
        throw error
    }
}
