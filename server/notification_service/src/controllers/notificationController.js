import mqttUtils from 'shared-mqtt';
import { getSubscriptionByClinicAndDate } from './subscriptionController.js';
const { publish, MQTT_TOPICS } = mqttUtils;

export const notifyAppointmentBooked = async (message) => {
    try {
        const { dentistId, startTime, endTime } = message;

        const start = new Date(startTime).toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        const end = new Date(endTime).toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
        const notificationEvent = {
            notification: `You have a new appointment booked at ${start} to ${end}`
        }
        await publish(MQTT_TOPICS.NOTIFICATION.APPOINTMENT.BOOKED(dentistId), notificationEvent);

    } catch (error) {
        console.error('Error sending notification', error)
    }
}

export const notifyAvailableSlots = async (message) => {
    try {
        // no need to JSON.parse here as the message comes from another service, not the frontend
        const { clinicId, clinicName, dates } = message;
        for (const date of dates) {
            await handleAvailabilityEvent(clinicId, clinicName, date);
        }
    } catch (error) {
        console.error('Error sending notification', error)
    }
}

const handleAvailabilityEvent = async (clinicId, clinicName, date) => {
    try {
        const payload = { clinicId, date };
        const subscription = await getSubscriptionByClinicAndDate(JSON.stringify(payload));

        // do nothing if nobody subscribed
        if (!subscription.data || subscription.data.length === 0) return

        const day = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const notificationEvent = {
            notification: `New appointment slots are now available on ${day} in ${clinicName}`
        };

        // only one subscription exists with provided 'clinicId' and 'date'
        const subscriptionItem = subscription.data[0];
        for (const patientId of subscriptionItem.patientId) {
            try {
                await publish(MQTT_TOPICS.NOTIFICATION.APPOINTMENT.CREATED(patientId), notificationEvent);
            } catch (mqttPublishError) {
                console.error(`Failed to send notification to patient ${patientId}: `, mqttPublishError);
            }
        }

    } catch (error) {
        console.error('Error handling availability event:', error);
        throw error
    }
}