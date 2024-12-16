# Clinic Service MQTT Endpoints Documentation

This document provides an overview of the MQTT endpoints used in the clinic service, detailing each endpoint's purpose, expected inputs, and outputs. It also includes a basic understanding of common system components like MQTT and clientId.

## Introduction to MQTT and clientId

**MQTT** (Message Queuing Telemetry Transport) is the chosen communication protocol for appointments service. MQTT works by exchanging messages (payloads) through topics between publishers and subscribers.

The **clientId**  is a unique identifier for each client connected to the MQTT broker. It is used to track message delivery and ensure that each client receives only the messages intended for it.

## MQTT Topics Structure

The MQTT topics are structured in a hierarchical way, structure as follows:

- CLINIC:
  - CREATE:
    - REQUEST:  `clinic/create`
    - RESPONSE: `clinic/create/${clientId}`
  - UPDATE:
    - REQUEST:  `clinic/update`
    - RESPONSE: `clinic/update/${clientId}`
  - REMOVE:
    - REQUEST:  `clinic/remove`
    - RESPONSE: `clinic/remove/${clientId}`
  - RETRIEVE:
    - ONE:
      - REQUEST:  `clinic/retrieveOne`
      - RESPONSE: `clinic/retrieveOne/${clientId}`
    - MANY:
      - REQUEST:  `clinic/retrieve`
      - RESPONSE: `clinic/retrieve/${clientId}`
  - ADD_DENTIST:
    - REQUEST:  `clinic/addDentist`
    - RESPONSE: `clinic/addDentist/${clientId}`

---

## Endpoints Details

Below is a detailed description of each MQTT endpoint in the clinic service, including the expected request payload and response.

### Create Clinic

Create a new clinic in the system.

- **Request Topic:** `clinic/create`
- **Response Topic:** `clinic/create/${clientId}`

**Request Payload:**

```json
{
  "name": "Clinic Name",
  "address": {
    "line1": "Address Line 1",
    "line2": "Address Line 2"
  },
  "phone": "Phone Number",
  "email": "Email Address",
  "position": ["latitude", "longitude"]
}
```

**Response Payload:**

```json
{
  "status": {
    "code": 200,
    "message": "Clinic created successfully"
  },
  "data": {
    "_id": "ObjectId",
    "name": "Clinic Name",
    "address": {
      "line1": "Address Line 1",
      "line2": "Address Line 2"
    },
    "phone": "Phone Number",
    "email": "Email Address",
    "position": ["latitude", "longitude"],
    "dentists": []
  }
}
```

### Update Clinic

Update an existing clinic's information.

- **Request Topic:** `clinic/update`
- **Response Topic:** `clinic/update/${clientId}`

**Request Payload:**

  ```json
  {
    "_id": "ObjectId",
    "name": "Updated Clinic Name",
    "address": {
      "line1": "Updated Address Line 1",
      "line2": "Updated Address Line 2"
    },
    "phone": "Updated Phone Number",
    "email": "Updated Email Address",
    "position": ["latitude", "longitude"]
  }
  ```

**Response Payload:**

  ```json
  {
    "status": {
      "code": 200,
      "message": "Clinic updated successfully"
    },
    "data": {
      "_id": "ObjectId",
      "name": "Updated Clinic Name",
      "address": {
        "line1": "Updated Address Line 1",
        "line2": "Updated Address Line 2"
      },
      "phone": "Updated Phone Number",
      "email": "Updated Email Address",
      "position": ["latitude", "longitude"],
      "dentists": []
    }
  }
  ```

### Remove Clinic

Delete a clinic from the system.

- **Request Topic:** `clinic/remove`
- **Response Topic:** `clinic/remove/${clientId}`

**Request Payload:**

  ```json
  {
    "_id": "ObjectId"
  }
  ```

**Response Payload:**

  ```json
  {
    "status": {
      "code": 200,
      "message": "Clinic removed successfully"
    }
  }
  ```

### Retrieve One Clinic

Retrieve information for a specific clinic.

- **Request Topic:** `clinic/retrieveOne`
- **Response Topic:** `clinic/retrieveOne/${clientId}`

**Request Payload:**

  ```json
  {
    "_id": "ObjectId"
  }
  ```

**Response Payload:**

  ```json
  {
    "status": {
      "code": 200,
      "message": "Clinic retrieved successfully"
    },
    "data": {
      "_id": "ObjectId",
      "name": "Clinic Name",
      "address": {
        "line1": "Address Line 1",
        "line2": "Address Line 2"
      },
      "phone": "Phone Number",
      "email": "Email Address",
      "position": ["latitude", "longitude"],
      "dentists": []
    }
  }
  ```

### Retrieve All Clinics

Retrieve information for all clinics.

- **Request Topic:** `clinic/retrieve`
- **Response Topic:** `clinic/retrieve/${clientId}`

**Request Payload:**

  ```json
  {}
  ```

**Response Payload:**

  ```json
  {
    "status": {
      "code": 200,
      "message": "Clinics retrieved successfully"
    },
    "data": [
      {
        "_id": "ObjectId",
        "name": "Clinic Name",
        "address": {
          "line1": "Address Line 1",
          "line2": "Address Line 2"
        },
        "phone": "Phone Number",
        "email": "Email Address",
        "position": ["latitude", "longitude"],
        "dentists": []
      }
    ]
  }
  ```

### Add Dentist to Clinic

Associate a dentist with a clinic.

- **Request Topic:** `clinic/addDentist`
- **Response Topic:** `clinic/addDentist/${clientId}`

**Request Payload:**

  ```json
  {
    "clinicId": "ObjectId",
    "dentistId": "Dentist ID"
  }
  ```

**Response Payload:**

```json
{
  "status": {
    "code": 200,
    "message": "Dentist added successfully"
  },
  "data": {
    "_id": "ObjectId",
    "name": "Clinic Name",
    "address": {
      "line1": "Address Line 1",
      "line2": "Address Line 2"
    },
    "phone": "Phone Number",
    "email": "Email Address",
    "position": ["latitude", "longitude"],
    "dentists": ["Dentist ID"]
    }
  }
  ```

## Clinic Data Structure

A clinic object has the following structure:

```json
{
  "_id": "ObjectId",
  "name": "string",
  "address": {
    "line1": "string",
    "line2": "string"
  },
  "phone": "string",
  "email": "string",
  "position": ["latitude", "longitude"],
  "dentists": ["ObjectId"]
}
```

**Field Descriptions**:

- **_id**(ObjectId): Unique identifier for the clinic.
- **name**(String): Name of the clinic.
- **address**(Object): Address object with line1 and line2 fields.
  - **line1**(String): First line of the address.
  - **line2**(String): Second line of the address.
- **phone**(String): Phone number of the clinic.
- **email**(String): Email address of the clinic.
- **position**(Array): Array with latitude and longitude coordinates.
  - **latitude**(Number): Latitude coordinate of the clinic.
  - **longitude**(Number): Longitude coordinate of the clinic.
- **dentists**(Array of ObjectId): Array of dentist IDs associated with the clinic.

## Example API Transaction

### Scenario

A client wants to create a new clinic and then retrieve it.

**Steps:**

1- **Create Clinic:**
  1. Subscribe to Response Topic with clientId

```js
subscribe('clinic/create/{clientId}')
```

  2. Publish to Create Clinic Topic with the requested payload

```json
{
  "name": "Teethsy Clinic",
  "address": {
    "line1": "123 Tooth Street",
    "line2": ""
  },
  "phone": "072 43",
  "email": "example@gmail.com",
  "position": [40.7128, -74.0060]
}
```
  3. Receive the response on the Response Topic

```json
{
  "status": {
    "code": 200,
    "message": "Clinic created successfully"
  },
  "data": {
    "_id": "aoissndijn12l3i34jn13k",
    "name": "Teethsy Clinic",
    "address": {
    "line1": "123 Tooth Street",
    "line2": ""
    },
    "phone": "072 43",
    "email": "example@gmail.com",
    "position": [40.7128, -74.0060],
    "dentists": []
  }
}
```

  4. Unsubscribe from the Response Topic

2- **Retrieve Clinic:**

  1. Subscribe to Response Topic with clientId

```js
subscribe('clinic/retrieveOne/{clientId}')
```

  2. Publish to Retrieve Clinic Topic with the requested payload

```json
{
  "_id": "aoissndijn12l3i34jn13k"
}
```

  3. Receive the response on the Response Topic

```json
{
  "status": {
    "code": 200,
    "message": "Clinic retrieved successfully"
  },
  "data": {
    "_id": "aoissndijn12l3i34jn13k",
    "name": "Teethsy Clinic",
    "address": {
    "line1": "123 Tooth Street",
    "line2": ""
    },
    "phone": "072 43",
    "email": "example@gmail.com",
    "position": [40.7128, -74.0060],
    "dentists": []
  }
}
```
  4. Unsubscribe from the Response Topic

## Error Handling

Responses include a **status** object with a **code** and **message** to indicate the result of the request.

Common status codes:

- Error codes:
  - `200`: Success
  - `400`: Bad Request (e.g., invalid input)
  - `404`: Not Found (e.g., clinic does not exist)
  - `500`: Internal Server Error

Always check the **status code** and handle errors appropriately in your client application.
Keep in mind that most of the time, data object does not exist in failure messages.