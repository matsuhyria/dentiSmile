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
            RESPONSE: (clientId) => `appointment/create/${clientId}`,
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
        RETRIEVE: {
            ONE: {
                REQUEST: 'appointment/retrieveOne',
                RESPONSE: (clientId) => `appointment/retrieve/${clientId}`
            },
            MANY: {
                REQUEST: 'appointment/retrieve',
                RESPONSE: (clientId) => `appointment/retrieve/${clientId}`
            }
        }
    },
    NOTIFICATION: {
        APPOINTMENT: {
            CREATE: 'notification/appointment/create',
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
    }
}