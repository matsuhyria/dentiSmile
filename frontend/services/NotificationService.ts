import { MQTT_TOPICS } from "./base/MQTTService";
import { subscribe, unsubscribe } from "shared-mqtt/mqttClient";
import { INotificationService, Message } from "./interfaces/INotificationService";

const { APPOINTMENT } = MQTT_TOPICS.NOTIFICATION

export class NotificationService implements INotificationService {
    private patientId: string

    constructor(patientId: string) {
        this.patientId = patientId
    }

    public async subscribeForAvailabilityNotifications(callback: (message: Message) => void): Promise<void> {
        try {
            const topic = APPOINTMENT.CREATED(this.patientId);
            await subscribe(topic, callback);
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to subscribe: ${error.message}`)
        }
    }

    public async subscribeForAppointmentCancellationNotifications(callback: (message: Message) => void): Promise<void> {
        try {
            const topic = APPOINTMENT.CANCELED(this.patientId);
            await subscribe(topic, callback);
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to subscribe: ${error.message}`)
        }
    }

    public async unsubscribeFromAllNotifications() {
        try {
            const topic = APPOINTMENT.CREATED(this.patientId);
            await unsubscribe(topic);
        } catch (error) {
            console.error(error)
            throw new Error(`Failed to subscribe: ${error.message}`)
        }
    }
}