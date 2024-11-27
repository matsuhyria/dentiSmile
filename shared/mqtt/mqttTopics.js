export const MQTT_TOPICS = {
    AUTHENTICATION: {
        REGISTER: {
            REQUEST: 'service/authentication/register',
            RESPONSE: (clientId) =>
                `client/${clientId}/authentication/register`,
        },
        LOGIN: {
            REQUEST: 'service/authentication/login',
            RESPONSE: (clientId) => `client/${clientId}/authentication/login`,
        },
    },
    PATIENT: {
        UPDATE_PROFILE: {
            REQUEST: 'service/patient/updateProfile',
            RESPONSE: (clientId) => `client/${clientId}/patient/updateProfile`,
        },
        BOOK_APPOINTMENT: {
            REQUEST: 'service/patient/bookAppointment',
            RESPONSE: (clientId) => `client/${clientId}/patient/bookAppointment`,
        },
        GET_APPOINTMENTS: {
            REQUEST: 'service/patient/getAppointments',
            RESPONSE: (clientId) => `client/${clientId}/patient/getAppointments`,
        },
    },
    DENTIST: {
        REGISTER_AVAILABILITY: {
            REQUEST: 'service/dentist/viewAppointments',
            RESPONSE: (clientId) =>
                `client/${clientId}/dentist/viewAppointments`,
        },
        CANCEL_APPOINTMENT: {
            REQUEST: 'service/dentist/cancelAppointment',
            RESPONSE: 'service/appointment/cancelAppointment',
        },
        REMOVE_APPOINTMENT: {
            REQUEST: 'service/dentist/removeAppointment',
            RESPONSE: 'service/appointment/removeAppointment',
        },
    },
    EVENTS: {
        USER_REGISTERED: 'events/user/registered',
        APPOINTMENT_BOOKED: 'events/appointment/booked',
        APPOINTMENT_CANCELED: 'events/appointment/canceled',
        APPOINTMENT_REMOVED: 'events/appointment/removed',
    },
}
