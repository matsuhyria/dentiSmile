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
        LOCK: {
            REQUEST: 'appointment/lock',
            RESPONSE: (clientId) => `appointment/clinic/retrieve/${clientId}`
        },
        UNLOCK: {
            REQUEST: 'appointment/unlock',
            RESPONSE: (clientId) => `appointment/clinic/retrieve/${clientId}`
        },
        RETRIEVE: {
            ONE: {
                REQUEST: 'appointment/retrieveOne',
                RESPONSE: (clientId) => `appointment/retreiveOne/${clientId}`
            },
            MANY: {
                REQUEST: 'appointment/retrieve',
                RESPONSE: (clientId) => `appointment/retrieve/${clientId}`
            }
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
                REQUEST: 'notification/appointment/subscription/create',
                RESPONSE: (clientId) => `notification/appointment/subscription/create/${clientId}`
            },
            RETRIEVE: {
                REQUEST: 'notification/appointment/subscription/retrieve',
                RESPONSE: (clientId) => `notification/appointment/subscription/retrieve/${clientId}`
            },
            CANCEL: {
                REQUEST: 'notification/appointment/subscription/cancel',
                RESPONSE: (clientId) => `notification/appointment/subscription/cancel/${clientId}`
            }
        },
        DATE: (clinic, date) => `notification/${clinic}/${date}`,
        APPOINTMENT: {
            CREATE: 'notification/appointment/create',
            BOOK: {
                REQUEST: (clientId) => `appointment/book/${clientId}`,
                RESPONSE: (clientId) =>
                    `notification/appointment/book/${clientId}`
            },
            CANCEL: {
                REQUEST: (clientId) => `appointment/cancel/${clientId}`,
                RESPONSE: (clientId) =>
                    `notification/appointment/cancel/${clientId}`
            }
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
