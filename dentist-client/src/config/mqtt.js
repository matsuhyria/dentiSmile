import mqttUtils from 'shared-mqtt'
const { connectMQTT } = mqttUtils;

const setupMQTT = async (MQTT_URI, MQTT_OPTIONS) => {
    try {
        await connectMQTT(MQTT_URI, MQTT_OPTIONS)
    } catch (error) {
        console.error('Error initializing MQTT', error)
    }
}

export default setupMQTT