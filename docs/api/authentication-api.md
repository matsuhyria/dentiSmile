# MQTT Endpoints Documentation

This document provides an overview of the MQTT endpoints used in the authentication service, detailing each endpoint's purpose, expected inputs, and outputs. It also includes a basic understanding of common system components like MQTT and clientId.

1. [Introduction to MQTT and clientId](#introduction-to-mqtt-and-clientid)
2. [MQTT Topics Structure](#mqtt-topics-structure)
3. [Endpoints Details](#endpoints-details)
4. [Handling Requests and Responses](#handling-requests-and-responses)
5. [Example Usage](#example-usage)
6. [Error Handling](#error-handling)

## Introduction to MQTT and clientId
**MQTT** (Message Queuing Telemetry Transport) is the chosen communication protocol for authentication service. MQTT works by exchanging messages (payloads) through topics between publishers and subscribers.

The **clientId**  is a unique identifier for each client connected to the MQTT broker. It is used to track message delivery and ensure that each client receives only the messages intended for it.

## MQTT Topics Structure

The MQTT topics are structured in a hierarchical way, structure as follows:

- AUTHENTICATION
    - REGISTER
        - REQUEST: `register`
        - RESPONSE: `register/${clientId}`
    - LOGIN
        - REQUEST: `login`
        - RESPONSE: `login/${clientId}`

## Endpoints Details

Below is a detailed description of each MQTT endpoint in the authentication service, including the expected request payload and response.

### Authentication Endpoints

#### Register User

Endpoint to register a new user. User password is hashed before saving. Returns a token if the registration is successful. 

Note that the **role** parameter can only be 'patient' as of now.

- **Request Topic**: register
- **Response Topic**: register/${clientId}

**Request Payload**:

```json
{
  "email": "String",
  "password": "String",
  "role": "String",
  "clientId": "String"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "Integer",
    "message": "String"
  },
  "token": "String"
}
```

#### Login User

Endpoint to login an existing user. Compares given credentials against a match in database. Returns a token if the login is successful.

- **Request Topic**: login
- **Response Topic**: login/${clientId}

**Request Payload**:

```json
{
  "email": "String",
  "password": "String",
  "clientId": "String"
}
```

**Response Payload**:

```json
{
  "status": {
    "code": "Integer",
    "message": "String"
  },
  "token": "String"
}
```

## Handling Requests and Responses

To interact with these MQTT endpoints:

1. **Subscribe** to the **response topic** using your **clientId** to receive the response.
2. **Publish** a message to the **request topic** with the required payload.
3. Save the **token** received in the response for future requests that require authentication.

## Example Usage

##### **Registering a User**:

**Publish to**: register

**Request Payload**:

```json
{
  "email": "example1@gmail.com",
  "password": "password",
  "role": "patient",
  "clientId": "64b8f7f1f1a4e8b1a1a1a1a1"
}
```

**Subscribe to**: register/64b8f7f1f1a4e8b1a1a1a1a1

**Response Payload**:

```json
{
  "status": {
    "code": 200,
    "message": "User registered successfully"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MzQzNjk2MTcsImV4cCI6MTc2NTkwNTYyMywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.o4xdspvz-1M5yNl6zSYh8KS8WDiPDdd3sZT7ZcZp5rA"
}
```

## Error Handling

Responses include a **status** object with a **code** and **message** to indicate the result of the request. 

Common status codes:

- `200`: Success
- `400`: Bad Request (e.g., missing or invalid parameters)
- `403`: Forbidden (e.g., user does not have permission)
- `404`: Not Found (e.g., user not found)
- `500`: Internal Server Error

Always check the **status code** and handle errors appropriately in your client application.
Keep in mind that, token object does not exist in failure messages.