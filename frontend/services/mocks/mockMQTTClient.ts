import { MQTT_TOPICS } from '@/services/base/MQTTService';
import { clinicOpenHours } from './data/clinicOpenHours';
import { bookedAppointments } from './data/bookedAppointments';
import { serviceDurations } from './data/serviceDurations';
import { calculateAvailability } from '../availabilityCalculator';

export function createMockMQTTClient() {
    const subscriptions = new Map<string, (message: string) => void>();

    return {
        subscribe(topic: string, callback: (message: string) => void) {
            subscriptions.set(topic, callback);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publish(topic: string, payload: any) {
            console.log(
                `[MOCK MQTT] Publish to ${topic}: ${JSON.stringify(payload)}`
            );

            const cb = subscriptions.get(topic);
            if (!cb) return;

            if (topic === MQTT_TOPICS.CLINICS.DETAILS.REQUEST) {
                const { clinicId, reasonId, date, attemptId } = payload;
                const duration =
                    serviceDurations[
                        reasonId as keyof typeof serviceDurations
                    ] || 30;
                const dayAppointments = bookedAppointments
                    .filter(
                        (appt) =>
                            appt.clinicId === clinicId && appt.date === date
                    )
                    .map((a) => ({ start: a.start, duration: a.duration }));

                const hours =
                    clinicOpenHours[clinicId as keyof typeof clinicOpenHours] ||
                    [];
                const times = calculateAvailability(
                    hours,
                    dayAppointments,
                    duration
                );

                cb(
                    JSON.stringify({
                        attemptId,
                        success: true,
                        data: {
                            clinicId,
                            name: 'Mock Dental Clinic',
                            address: '123 Mock St',
                            services: Object.keys(serviceDurations),
                            availability: times
                        }
                    })
                );
            } else if (
                topic === MQTT_TOPICS.APPOINTMENT.REQUEST_AVAILABILITY.REQUEST
            ) {
                const { attemptId, clinicId, reasonId, date, slot } = payload;
                cb(
                    JSON.stringify({
                        attemptId,
                        success: true,
                        data: {
                            appointmentId: 'mock_appointment_001',
                            clinicId,
                            reasonId,
                            date,
                            slot
                        }
                    })
                );
            }
        },
        disconnect() {
            console.log('[MOCK MQTT] Disconnected');
        }
    };
}
