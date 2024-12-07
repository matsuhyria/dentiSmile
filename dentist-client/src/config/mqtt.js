import {
    connectMQTT,
} from '../../../shared/mqtt/mqtt.js'

const setupMQTT = async (MQTT_URI, MQTT_OPTIONS) => {
    try {
        console.log('Connecting to MQTT Broker...')
        console.log('MQTT_URI:', MQTT_URI)
        console.log('MQTT_OPTIONS:', MQTT_OPTIONS)
        await connectMQTT(MQTT_URI, MQTT_OPTIONS)
    } catch (error) {
        console.error('Error initializing MQTT', error)
    }
}

export default setupMQTT