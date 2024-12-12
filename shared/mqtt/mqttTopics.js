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
        RETREIVE: {
            ONE: {
                REQUEST: 'appointment/retreiveOne',
                RESPONSE: (clientId) => `appointment/retreive/${clientId}`
            },
            MANY: {
                REQUEST: 'appointment/retreive',
                RESPONSE: (clientId) => `appointment/retreive/${clientId}`
            }
        }
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
    CLINIC: {
        CREATE: {
            REQUEST: 'clinic/create',
            RESPONSE: (clientId) => `clinic/create/${clientId}`
        },
        UPDATE: {
            REQUEST: 'clinic/update',
            RESPONSE: (clientId) => `clinic/update/${clientId}`
        }
    }
}