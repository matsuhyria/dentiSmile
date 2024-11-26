export const MQTT_TOPICS = {
  AUTHENTICATION: {
    REGISTER: {
      REQUEST: "service/authentication/register",
      RESPONSE: (clientId) => `client/${clientId}/authentication/register`,
    },
    LOGIN: {
      REQUEST: "service/authentication/login",
      RESPONSE: (clientId) => `client/${clientId}/authentication/login`,
    },
  },
  PATIENT: {
    UPDATE_PROFILE: {
      REQUEST: "service/patient/updateProfile",
      RESPONSE: (clientId) => `client/${clientId}/patient/updateProfile`,
    },
  },
  DENTIST: {
    REGISTER_AVAILABILITY: {
      REQUEST: "service/dentist/viewAppointments",
      RESPONSE: (clientId) => `client/${clientId}/dentist/viewAppointments`,
    },
  },
  EVENTS: {
    USER_REGISTERED: "events/user/registered",
    APPOINTMENT_BOOKED: "events/appointment/booked",
  },
};
