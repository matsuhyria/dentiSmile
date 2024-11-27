import { createAppointments, getAppointments, bookAppointment, getSlotDetails, cancelAppointment, removeAppointment } from '../controllers/appointmentController.js';
import { subscribe, publish } from '../../../../shared/mqtt/mqtt.js';
import { MQTT_TOPICS } from '../../../../shared/mqtt/mqttTopics.js';

const mqttRouter = async () => {
    
    // Cancel Appointment
    await subscribe(MQTT_TOPICS.DENTIST.CANCEL_APPOINTMENT.REQUEST, async (message) => {
        publish(MQTT_TOPICS.DENTIST.CANCEL_APPOINTMENT.RESPONSE, await cancelAppointment(message))
    })

    // Remove Appointment
    await subscribe(MQTT_TOPICS.DENTIST.REMOVE_APPOINTMENT.REQUEST, async (message) => {
        publish(MQTT_TOPICS.DENTIST.REMOVE_APPOINTMENT.RESPONSE, await removeAppointment(message))
    })

    /* await subscribe(MQTT_TOPICS.DENTIST.REGISTER_AVAILABILITY.REQUEST, (message) => {
        console.log(`Received message on topic ${message}`)
        publish(MQTT_TOPICS.DENTIST.REGISTER_AVAILABILITY.RESPONSE, createAppointments(message))
    }) */
    await subscribe(MQTT_TOPICS.DENTIST.CANCEL_APPOINTMENT.REQUEST, (message) => {
        console.log(`Received message on topic ${message}`)
        // publish(MQTT_TOPICS.DENTIST.CANCEL_APPOINTMENT.RESPONSE, cancelAppointment(message))
    })
    await subscribe(MQTT_TOPICS.DENTIST.REMOVE_APPOINTMENT.REQUEST, (message) => {
        console.log(`Received message on topic ${message}`)
        // publish(MQTT_TOPICS.DENTIST.REMOVE_APPOINTMENT.RESPONSE, removeAppointment(message))
    })
}

export default mqttRouter;