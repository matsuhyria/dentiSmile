# **MQTT Documentation**

---

## **Table of Contents**

1. [Overview](#overview)
2. [MQTT Topic Structure](#mqtt-topic-structure)
3. [List of MQTT Topics](#list-of-mqtt-topics)
4. [Message Payloads](#message-payloads)
5. [Topic Definitions](#topic-definitions)
6. [Examples](#examples)
7. [Best Practices](#best-practices)
8. [Security Considerations](#security-considerations)
9. [Shared MQTT Module](#shared-mqtt-module)
10. [Updating and Extending Topics](#updating-and-extending-topics)

---

## **Overview**

Our project utilizes MQTT as the primary messaging protocol for:

* **Inter-Service Communication** : Microservices publish and subscribe to events to coordinate actions without tight coupling.
* **Client-Service Communication** : Clients (frontend applications) communicate with services through MQTT for real-time interactions.

MQTT enables efficient, scalable, and asynchronous communication suitable for our microservices architecture.

---

## **MQTT Topic Structure**

### **Naming Conventions**

We follow a structured naming convention for MQTT topics to maintain clarity and consistency:

* **Prefixes** :
* `service/`: Topics for client requests to services.
* `client/`: Topics for service responses to specific clients.
* `events/`: Topics for inter-service events.

### **Topic Hierarchy**

* **Service Requests** : `service/{serviceName}/{action}`
* **Client Responses** : `client/{clientId}/{serviceName}/{action}`
* **Events** : `events/{eventCategory}/{eventName}`

### **Variables**

* `{clientId}`: Unique identifier for a client.
* `{userId}`: Unique identifier for a user (patient or dentist).
* `{serviceName}`: Name of the service (e.g., `authentication`, `patient`).
* `{action}`: Specific action or operation (e.g., `login`, `updateProfile`).
* `{eventCategory}`: Category of the event (e.g., `user`, `appointment`).
* `{eventName}`: Specific event name (e.g., `registered`, `booked`).

---

## **List of MQTT Topics**

### **Authentication Service**

* **Login Request**
  * Topic: `service/authentication/login`
  * Publisher: Client
  * Subscriber: Authentication Service
* **Login Response**
  * Topic: `client/{clientId}/authentication/login`
  * Publisher: Authentication Service
  * Subscriber: Specific Client
* **Register Request**
  * Topic: `service/authentication/register`
  * Publisher: Client
  * Subscriber: Authentication Service
* **Register Response**
  * Topic: `client/{clientId}/authentication/register`
  * Publisher: Authentication Service
  * Subscriber: Specific Client

### **Patient Service**

* **Update Profile Request**
  * Topic: `service/patient/updateProfile`
  * Publisher: Client
  * Subscriber: Patient Service
* **Update Profile Response**
  * Topic: `client/{clientId}/patient/updateProfile`
  * Publisher: Patient Service
  * Subscriber: Specific Client

### **Dentist Service**

* **View Appointments Request**
  * Topic: `service/dentist/viewAppointments`
  * Publisher: Client
  * Subscriber: Dentist Service
* **View Appointments Response**
  * Topic: `client/{clientId}/dentist/viewAppointments`
  * Publisher: Dentist Service
  * Subscriber: Specific Client

### **Events**

* **User Registered**
  * Topic: `events/user/registered`
  * Publisher: Authentication Service
  * Subscribers: Patient Service, Dentist Service
* **Appointment Booked**
  * Topic: `events/appointment/booked`
  * Publisher: Appointment Service
  * Subscribers: Dentist Service, Notification Service

## **Message Payloads**

### **Standard Structure**

All MQTT messages follow a standard JSON structure:

```
{
  "data": { /* Action-specific data */ },
  "token": "jwt-token" // If authentication is required
}
```

### **Fields Explained**

* **`data`** : Contains the payload specific to the action being performed.
* **`token`** : JWT token for authentication (if required).

---

## **Topic Definitions**

### **Authentication Service**

#### **Login**

* **Request Topic** : `service/authentication/login`
* **Response Topic** : `client/{clientId}/authentication/login`
* **Purpose** : Allows clients to authenticate and receive a JWT token.

#### **Register**

* **Request Topic** : `service/authentication/register`
* **Response Topic** : `client/{clientId}/authentication/register`
* **Purpose** : Allows new users to register as patients or dentists.

### **Patient Service**

#### **Update Profile**

* **Request Topic** : `service/patient/updateProfile`
* **Response Topic** : `client/{clientId}/patient/updateProfile`
* **Purpose** : Enables patients to update their personal information.

### **Dentist Service**

#### **View Appointments**

* **Request Topic** : `service/dentist/viewAppointments`
* **Response Topic** : `client/{clientId}/dentist/viewAppointments`
* **Purpose** : Allows dentists to register their available time slots.

### **Events**

#### **User Registered**

* **Topic** : `events/user/registered`
* **Purpose** : Notifies services that a new user has registered.

#### **Appointment Booked**

* **Topic** : `events/appointment/booked`
* **Purpose** : Notifies services that an appointment has been booked.

---

## **Examples**

### **Login Request**

 **Topic** : `service/authentication/login`

 **Payload** :

```
{
  "data": {
    "email": "user@example.com",
    "password": "securePassword123"
  }
}
```

### **Login Response**

 **Topic** : `client/client123/authentication/login`

 **Payload** :

```
{
  "status": "success",
  "data": {
    "token": "jwt-token",
    "expiresIn": 3600
  }
}
```

### **User Registered Event**

 **Topic** : `events/user/registered`

 **Payload** :

```
{
  "userId": "user-456",
  "role": "patient",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com"
}
```

---

## **Best Practices**

1. **Use Standardized Topic Definitions** : Always use the shared topic definitions to avoid typos and inconsistencies.
2. **Secure Tokens** : Always include JWT tokens in requests that require authentication.
3. **Error Handling** : In case of errors, include meaningful error messages in the response payload.
4. **Maintain Topic Hierarchies** : Organize topics logically to reflect the system's structure.

---

## **Security Considerations**

* **Access Control Lists (ACLs)** : Configure the MQTT broker to restrict clients and services to only the topics they are authorized to publish or subscribe to.
* **Authentication** : Require clients to authenticate with the broker before connecting.
* **Token Validation** : Services must validate JWT tokens included in requests.

---

## **Shared MQTT Module**

We have a shared MQTT client module (`mqttClient.js`) that:

* Manages MQTT connections.
* Provides functions for publishing and subscribing.
* Centralizes common MQTT logic to avoid duplication.

### **Usage**

* **Connecting** : Use `connectMQTT(options)` to establish a connection.
* **Publishing** : Use `publishMessage(topic, message)` to publish messages.
* **Subscribing** : Use `subscribe(topic, handler)` to handle incoming messages.

---

## **Updating and Extending Topics**

When adding new topics:

1. **Update `mqttTopics.js`** : Add the new topic definitions to the shared module.
2. **Maintain Consistency** : Follow the established naming conventions.
3. **Communicate Changes** : Inform the team about the new topics and their purposes.
4. **Update ACLs** : Adjust the broker's access control lists as necessary.
