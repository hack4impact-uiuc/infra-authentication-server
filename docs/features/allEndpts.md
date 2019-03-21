---
name: All Endpoints
route: /allendpoints/
---

Endpoints Reference

# Endpoints

This is a POST request endpoint that allows for email reset of a password for a user in the database.

In order to get email set up, please follow the linked instructions.

To issue a password reset email, you will send a POST request to `/forgotPassword/` with the following in the body:

```json
{
    email: test@example.com,
    security_answer: abc
}
```

Note that a JWT is not needed for this because the user does not need to have any form of authentication.

## Get Security Question

Get the security question stored with user - this is required if the field `securityQuestion` is set to true in the `config.yaml` file.

**URL** : `/getSecurityQuestion?email=test@example.com`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

### Response

**Code** : `200 OK` if the user could be successfully found.

**Code** : `500` if there was an internal server error and the security question couldn't be retrieved, or the `securityQuestion` is not configured.

**Code** : `400` if the email requested did not exist in the database.

**Content examples**

The API will return the following if the password was successfully reset:

```json
{
  "status": 200,
  "question": "What street did you grow up on?"
}
```

## Reset Password

Get the details of the currently Authenticated User along with basic
subscription information.

**URL** : `/forgotPassword`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

### Request

The following is an example request to the endpoint:

```json
{
    email: test@example.com,
    answer: main street
}
```

Where `answer` is the answer to the security question previously fetched with `getSecurityQuestion`.

### Response

**Code** : `200 OK` if all the fields match up and the password reset token could be issued successfully.

**Code** : `500` if there was a server issue (mail server, DB connection, etc.)

**Code** : `400` if there was an issue with the email being invalid.

**Content examples**

If the email could successfully be sent, the API will return:

```json
{
  "status": 200,
  "message": "Sent password reset PIN to user if they exist in the database."
}
```

## Verify Password Reset

Get the details of the currently Authenticated User along with basic
subscription information.

**URL** : `/resetPassword`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

### Request

The following is an example request to the endpoint:

```json
{
    email: test@example.com,
    pin: 75834921,
    password: verysecurepassword

}
```

### Response

**Code** : `200 OK` if the user had an updated password.

**Code** : `500` if there was an internal server error and the password could not be updated.

**Code** : `400` if there was an issue with the PIN being expired or a mismatch in email/PIN.

**Content examples**

The API will return the following if the password was successfully reset:

```json
{
  "status": 200,
  "message": "Password successfully reset.",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxM"
}
```

# Login and Logout

## Endpoints

| Endpoint | /login [POST] (redirected from API to Server)                     |
| -------- | ----------------------------------------------------------------- |
| body     | email, hashed password                                            |
| response | message: success/error, jwt token if the account is authenticated |

# Register

## Endpoints

| Endpoint | /register [POST] (redirected from API to Server)                            |
| -------- | --------------------------------------------------------------------------- |
| body     | email, username, hashed password, permission level, phone number (optional) |
| response | message: success/error, jwt token if the account is authenticated           |
