export const MQTT_TOPICS = {
    AUTHENTICATION: {
        REGISTER: {
            REQUEST: 'register',
            RESPONSE: (clientId) => `register/${clientId}`,
        },
        LOGIN: {
            REQUEST: 'login',
            RESPONSE: (clientId) => `login/${clientId}`,
        },
    },
    APPOINTMENT: {
        CREATE: {
            REQUEST: 'appointment/create',
            RESPONSE: (clientId) => `appointment/create/${clientId}`
        },
        DELETE: {
            REQUEST: 'appointment/delete',
            RESPONSE: (clientId) => `appointment/delete/${clientId}`
        },
        BOOK: {
            REQUEST: 'appointment/book',
            RESPONSE: (clientId) => `appointment/book/${clientId}`
        },
        CANCEL: {
            REQUEST: 'appointment/cancel',
            RESPONSE: (clientId) => `appointment/cancel/${clientId}`
        },
    },
    NOTIFICATION: {
        APPOINTMENT: {
            CREATE: {
                REQUEST: (clientId) => `appointment/create/${clientId}`,
                RESPONSE: (clientId) => `notification/appointment/create/${clientId}`
            },
            DELETE: {
                REQUEST: (clientId) => `appointment/delete/${clientId}`,
                RESPONSE: (clientId) => `notification/appointment/delete/${clientId}`
            },
            BOOK: {
                REQUEST: (clientId) => `appointment/book/${clientId}`,
                RESPONSE: (clientId) => `notification/appointment/book/${clientId}`
            },
            CANCEL: {
                REQUEST: (clientId) => `appointment/cancel/${clientId}`,
                RESPONSE: (clientId) => `notification/appointment/cancel/${clientId}`
            },
        }
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
        GET_APPOINTMENTS: {
            REQUEST: 'service/dentist/getAppointments',
            RESPONSE: (clientId) =>
                `client/${clientId}/dentist/getAppointments`,
        },
        GET_APPOINTMENT: {
            REQUEST: 'service/dentist/getAppointment',
            RESPONSE: (clientId) =>
                `client/${clientId}/dentist/getAppointment`,
        },
        REGISTER_AVAILABILITY: {
            REQUEST: 'service/dentist/viewAppointments',
            RESPONSE: (clientId) =>
                `client/${clientId}/dentist/viewAppointments`,
        },
        CANCEL_APPOINTMENT: {
            REQUEST: 'service/dentist/cancelAppointment',
            RESPONSE: (clientId) =>
                `client/${clientId}/dentist/cancelAppointment`,
        },
        REMOVE_APPOINTMENT: {
            REQUEST: 'service/dentist/removeAppointment',
            RESPONSE: (clientId) =>
                `client/${clientId}/dentist/removeAppointment`,
        },
    }
}