export const MQTT_TOPICS = {
    AUTHENTICATION: {
        REGISTER: {
            REQUEST: 'register',
            RESPONSE: (clientId) => `register/${clientId}`
        },
        LOGIN: {
            REQUEST: 'login',
            RESPONSE: (clientId) => `login/${clientId}`
        }
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
        RETRIEVE: {
            ONE: {
                REQUEST: 'appointment/retrieveOne',
                RESPONSE: (clientId) => `appointment/retreiveOne/${clientId}`
            },
            MANY: {
                REQUEST: 'appointment/retrieve',
                RESPONSE: (clientId) => `appointment/retrieve/${clientId}`
            },
        },
        CLINIC: {
            RETRIEVE: {
                REQUEST: 'appointment/clinic/retrieve',
                RESPONSE: (clientId) => `appointment/clinic/retrieve/${clientId}`
            }
        },
        PATIENT: {
            RETRIEVE: {
                REQUEST: 'appointment/patient/retrieve',
                RESPONSE: (clientId) => `appointment/patient/retrieve/${clientId}`
            }
        }
    },
    NOTIFICATION: {
        SUBSCRIPTION: {
            CREATE: {
                REQUEST: 'notification/subscription/create',
                RESPONSE: (clientId) => `notification/subscription/create/${clientId}`
            },
            RETRIEVE: {
                REQUEST: 'notification/subscription/retrieve',
                RESPONSE: (clientId) => `notification/subscription/retrieve/${clientId}`
            },
            CANCEL: {
                REQUEST: 'notification/subscription/cancel',
                RESPONSE: (clientId) => `notification/subscription/cancel/${clientId}`
            }
        },
        EVENT: {
            AVAILABILITY: 'notification/event/availability',
            APPOINTMENT: {
                CANCELED: 'notification/event/appointment/canceled'
            }
        },
        APPOINTMENT: {
            CREATED: (clientId) => `notification/appointment/created/${clientId}`,
            BOOK: {
                REQUEST: (clientId) => `appointment/book/${clientId}`,
                RESPONSE: (clientId) =>
                    `notification/appointment/book/${clientId}`
            },
            CANCELED: (clientId) => `notification/appointment/canceled/${clientId}`
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
        },
        REMOVE: {
            REQUEST: 'clinic/remove',
            RESPONSE: (clientId) => `clinic/remove/${clientId}`
        },
        RETRIEVE: {
            ONE: {
                REQUEST: 'clinic/retrieveOne',
                RESPONSE: (clientId) => `clinic/retrieveOne/${clientId}`
            },
            MANY: {
                REQUEST: 'clinic/retrieve/request',
                RESPONSE: (clientId) => `clinic/retrieve`
            }
        },
        ADD_DENTIST: {
            REQUEST: 'clinic/addDentist'
        }
    },
    CLINICS: {
        UPDATED: 'clinics/updated',
        DETAILS: {
            REQUEST: 'clinics/detailsRequest',
            RESPONSE: 'clinics/detailsResponse'
        }
    },
    REASONS: {
        UPDATED: 'REASONS_UPDATED'
    }
}
