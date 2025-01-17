import { MqttClient } from 'mqtt'
import mqtt from 'shared-mqtt'
import { MQTT_BROKER_URL } from '@/lib/constants'

const { connectMQTT, MQTT_TOPICS } = mqtt

class MQTTService {
    private static instance: MqttClient

    public static async getClient() {
        if (!MQTTService.instance) {
            MQTTService.instance = await connectMQTT(MQTT_BROKER_URL)
        }
        return MQTTService.instance
    }
}

export { MQTTService, MQTT_TOPICS }
