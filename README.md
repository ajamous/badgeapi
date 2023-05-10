# Badgeapi (Visitor Management System API)

This is an API for a visitor management system that allows registering new visitors and generating a ticket with a unique QR code that can be used for verification.

**Dependencies**

This project requires the following dependencies:

```json

{
  "dependencies": {
    "cors": "^2.8.5",
    "body-parser": "^1.19.0",
    "express": "^4.17.2",
    "sequelize": "^6.6.5",
    "uuid": "^8.3.2",
    "qrcode": "^1.4.4",
    "fs": "0.0.1-security"
  }

```

Register
This endpoint is used to register a new visitor.


```shell
POST /register

```

Request body:

```json

{
  "name": "John Doe",
  "phone": "555-1234",
  "email": "john.doe@example.com",
  "company": "Acme Inc."
}


```

Response

```json
{
  "success": true,
  "ticket": {
    "id": "6ddad93a-4f86-4ab6-9f5d-9db692fa1d24",
    "name": "John Doe",
    "phone": "555-1234",
    "email": "john.doe@example.com",
    "company": "Acme Inc.",
    "registeredAt": "2023-05-10T18:30:00.000Z",
    "qrcodeDataURL": "data:image/png;base64,iVBORw0KGg..."
  }
}

```

## Verify

This endpoint is used to verify the ticket

```shell
GET /verify/:ticketId
```

Response:

```json
{
  "success": true,
  "ticket": {
    "id": "6ddad93a-4f86-4ab6-9f5d-9db692fa1d24",
    "name": "John Doe",
    "phone": "555-1234",
    "email": "john.doe@example.com",
    "company": "Acme Inc.",
    "registeredAt": "2023-05-10T18:30:00.000Z",
    "Status": "PASS"
  }
}


```

Generated Badge Sample:

<img width="619" alt="Screenshot 2023-05-10 at 3 44 10 PM" src="https://github.com/ajamous/badgeapi/assets/19316784/972dc418-0d4f-4e50-92b5-cd7668568726">



**How to run the project**

- Clone the repository.
- Install the dependencies with npm install.
- Start the server with npm start.
- The API will be available at http://localhost:3000.

**License**

This project is licensed under the MIT License - see the LICENSE file for details.
