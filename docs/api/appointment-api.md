# MQTT Endpoints Documentation

This document provides an overview of the MQTT endpoints used in the appointment service, detailing each endpoint's purpose, expected inputs, and outputs. It also includes a basic understanding of common system components like MQTT and clientId.

1. [Introduction to MQTT and clientId](#introduction-to-mqtt-and-clientid)
2. [MQTT Topics Structure](#mqtt-topics-structure)
3. [Endpoints Details](#endpoints-details)
4. [Handling Requests and Responses](#handling-requests-and-responses)
5. [Example Usage](#example-usage)
6. [Error Handling](#error-handling)

## Introduction to MQTT and clientId
**MQTT** (Message Queuing Telemetry Transport) is the chosen communication protocol for appointments service. MQTT works by exchanging messages (payloads) through topics between publishers and subscribers.

The **clientId**  is a unique identifier for each client connected to the MQTT broker. It is used to track message delivery and ensure that each client receives only the messages intended for it.

## MQTT Topics Structure

The MQTT topics are structured in a hierarchical way, structure as follows:

- Appointment
	- CREATE:
		- REQUEST:  `appointment/create`
		- RESPONSE: `appointment/create/${clientId}`
	- BOOK:
		- REQUEST:  `appointment/book`
		- RESPONSE: `appointment/book/${clientId}`
	- DELETE:
		- REQUEST:  `appointment/delete`
		- RESPONSE: `appointment/delete/${clientId}`
	- CANCEL:
		- REQUEST:  `appointment/cancel`
		- RESPONSE: `appointment/cancel/${clientId}`
	- RETRIEVE:
		- ONE:
			- REQUEST:  `appointment/retrieveOne`
			- RESPONSE: `appointment/retrieve/${clientId}`
		- MANY:
			- REQUEST:  `appointment/retrieve`
			- RESPONSE: `appointment/retrieve/${clientId}`

## Endpoints Details

Below is a detailed description of each MQTT endpoint in the appointments service, including the expected request payload and response.

### Appointment Endpoints

#### Create Appointment Slots

- **Request Topic**: appointment/create
- **Response Topic**: appointment/create/{clientId}

**Request Payload**:

```json
{
  "data": {
    "dentistId": "ObjectId",
    "startTime": "Date",
    "endTime": "Date",
    "rangeMinutes": "integer",
    "isSingleDay": "boolean"
  },
  "clientId": "ObjectId"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "integer",
    "message": "string"
  }
}
```

#### Delete Appointment Slot

- **Request Topic**: appointment/delete
- **Response Topic**: appointment/delete/{clientId}

**Request Payload**:

```json
{
  "data": {
    "appointmentId": "ObjectId"
  },
  "clientId": "string"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "integer",
    "message": "string"
  },
  "data": {
    // Deleted appointment details
  }
}
```

#### Book Appointment

- **Request Topic**: appointment/book
- **Response Topic**: appointment/book/{clientId}

**Request Payload**:

```json
{
  "data": {
    "patientId": "ObjectId",
    "appointmentId": "ObjectId"
  },
  "clientId": "string"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "integer",
    "message": "string"
  },
  "data":{
	  // Booked appointment slot details
  }
}
```

#### Cancel Appointment

- **Request Topic**: appointment/cancel
- **Response Topic**: appointment/cancel/{clientId}

**Request Payload**:

```json
{
  "data": {
    "appointmentId": "ObjectId"
  },
  "clientId": "string"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "integer",
    "message": "string"
  },
  "data": {
    // Updated appointment details
  }
}
```

#### Retrieve Single Appointment

- **Request Topic**: appointment/retrieveOne
- **Response Topic**: appointment/retrieve/{clientId}

**Request Payload**:

```json
{
  "data": {
    "appointmentId": "ObjectId"
  },
  "clientId": "string"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "integer",
    "message": "string"
  },
  "data": {
    // Appointment slot details
  }
}
```

#### Retrieve Appointments

- **Request Topic**: appointment/retrieve
- **Response Topic**: appointment/retrieve/{clientId}

**Request Payload**:

```json
{
  "data": {
    "dentistId": "ObjectId",
    "startingDate": "DateTime",
    "endingDate": "DateTime"
  },
  "clientId": "string"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "integer",
    "message": "string"
  },
  "data": [
    // List of appointment slots
  ]
}
```

## Handling Requests and Responses

To interact with these MQTT endpoints:

1. **Subscribe** to the **response topic** using your **clientId** to receive the response.
2. **Publish** a message to the **request topic** with the required payload.

## Example Usage

##### **Booking an appointment**:

**Publish to**: appointment/book

**Payload**:

```json
{
  "data": {
    "patientId": "673d250e840b29fc54c9da0c",
    "appointmentId": "64b8f7f1f1a4e8b1a1a1a1a1"
  },
  "clientId": "oimdfasjdsandwichopiaujnspod"
}
```

**Subscribe to**: appointment/book/oimdfasjdsandwichopiaujnspod

**Response**:

```json
{
  "status": {
    "code": 200,
    "message": "Appointment slot booked successfully"
  },
  "slot": {
    "_id": "64b8f7f1f1a4e8b1a1a1a1a1",
    "dentistId": "64b8f7f1f1a4e8b1a1a1a1a3",
    "patientId": "673d250e840b29fc54c9da0c",
    "startTime": "2024-12-05T08:00:00.000Z",
    "startTime": "2024-12-05T09:00:00.000Z",
    "status": "booked"
  }
}
```

## Error Handling

Responses include a **status** object with a **code** and **message** to indicate the result of the request. 

Common status codes:

- `200`: Success
- `400`: Bad Request (e.g., missing or invalid parameters)
- `404`: Not Found (e.g., appointment not found)
- `500`: Internal Server Error

Always check the **status code** and handle errors appropriately in your client application.
Keep in mind that most of the time, data object does not exist in failure messages.