import redisClient from "../config/cache.js";

const EXPIRE_IN = 96 * 60 * 60; // 96 hours

export const cacheAppointments = async (clinicId, appointmentsData) => {
    const key = `appointment:${clinicId}`;
    await redisClient.set(key, JSON.stringify(appointmentsData), {
        EX: EXPIRE_IN,
        NX: true // cache if not exists yet
    });
    console.log('Appointment cached, id:', clinicId);
}

export const getAppointmentFromCache = async (clinicId) => {
    const key = `appointment:${clinicId}`;
    const appointment = await redisClient.get(key);
    console.log('Retrieving appointments from cache', appointment);
    return appointment;
}

