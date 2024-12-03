import { createAppointments, getAppointments, bookAppointment, getSlotDetails, cancelAppointment, removeAppointment } from '../controllers/appointmentController.js';
import mqttUtils from 'shared-mqtt'
const { subscribe, publish } = mqttUtils;
import { MQTT_TOPICS } from '../../../../shared/mqtt/mqttTopics.js';

const mqttRouter = async () => {

    /* 
        Dentist Related Topics
    */

   // Get Appointments for Dentist
   await subscribe(MQTT_TOPICS.DENTIST.GET_APPOINTMENTS.REQUEST, async (message) => {
       console.log('Get Appointments Request:', message);
       publish(MQTT_TOPICS.DENTIST.GET_APPOINTMENTS.RESPONSE(message.clientId), await getAppointments(message))
   })
    
    // Get Appointment for Dentist
    await subscribe(MQTT_TOPICS.DENTIST.GET_APPOINTMENT.REQUEST, async (message) => {
        console.log('Get Appointment Request:', message);
        publish(MQTT_TOPICS.DENTIST.GET_APPOINTMENT.RESPONSE(message.clientId), await getSlotDetails(message))
    })
    
    // Create Appointments for Dentist
    await subscribe(MQTT_TOPICS.DENTIST.REGISTER_AVAILABILITY.REQUEST, async (message) => {
        console.log('Create Appointments Request:', message);
        publish(MQTT_TOPICS.DENTIST.REGISTER_AVAILABILITY.RESPONSE(message.clientId), await createAppointments(message))
    })
    
    // Cancel Appointment for Dentist
    await subscribe(MQTT_TOPICS.DENTIST.CANCEL_APPOINTMENT.REQUEST, async (message) => {
        console.log('Cancel Appointment Request:', message);
        publish(MQTT_TOPICS.DENTIST.CANCEL_APPOINTMENT.RESPONSE(message.clientId), await cancelAppointment(message))
    })
    
    // Remove Appointment for Dentist
    await subscribe(MQTT_TOPICS.DENTIST.REMOVE_APPOINTMENT.REQUEST, async (message) => {
        console.log('Remove Appointment Request:', message);
        publish(MQTT_TOPICS.DENTIST.REMOVE_APPOINTMENT.RESPONSE(message.clientId), await removeAppointment(message))
    })

    /* 
        Patient Related Topics
    */

    // Get Appointments for Patient
    await subscribe(MQTT_TOPICS.PATIENT.GET_APPOINTMENTS.REQUEST, async (message) => {
        console.log('Get Appointments Request:', message);
        publish(MQTT_TOPICS.PATIENT.GET_APPOINTMENTS.RESPONSE(message.clientId), await getAppointments(message))
    })

    // Book Appointment for Patient
    await subscribe(MQTT_TOPICS.PATIENT.BOOK_APPOINTMENT.REQUEST, async (message) => {
        console.log('Book Appointment Request:', message);
        publish(MQTT_TOPICS.PATIENT.BOOK_APPOINTMENT.RESPONSE(message.clientId), await bookAppointment(message))
    })
}

export default mqttRouter;