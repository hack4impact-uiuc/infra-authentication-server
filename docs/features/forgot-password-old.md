---
name: Forgot Password Old
route: /forgot/
---

<script src="webfont.js"></script>
<script src="snap.svg-min.js"></script>
<script src="underscore-min.js"></script>
<script src="sequence-diagram-min.js"></script>

# Forgot Password

This is a POST request endpoint that allows for email reset of a password for a user in the database.

## Setup

In order to get email set up, please follow [these](https://developers.google.com/gmail/api/quickstart/nodejs) instructions.

However, important note about setting up the code. Make sure to change the`SCOPES` variable in the `index.js` file mentioned in the setup instructions to the following.

```javascript
const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];
```

This will allow the API to send emails. Not doing this will result in emails being unable to be sent.

You will then place the generated API keys in the appropriate config file.

## Get Security Question

Get the security question stored with user - this is required if the field `securityQuestion` is set to true in the `config.yaml` file.

**URL** : `/getSecurityQuestion`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

### Request

The following is an example request to the endpoint:

```json
{
    email: test@example.com
}
```

### Response

**Code** : `200 OK` if the user could be successfully found.

**Code** : `500` if there was an internal server error and the security question couldn't be retrieved, or the `securityQuestion` is not configured.

**Code** : `400` if the email requested did not exist in the database, or invalid arguments were specified to the API.

**Content examples**

The API will return the following format if the password was successfully reset:

```json
{
  "status": 200,
  "question": "What street did you grow up on?"
}
```

## Send Forgot Password Email

This endpoint allows for the sending of a PIN to the user by email.

If security question is enabled in the config file, you must specify the answer to the security question retrieved
from `/getSecurityQuestion` in order for the PIN to be
successfully sent to the user.
If Gmail is not enabled in the config file, this endpoint will return a `500` server error.

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

**Code** : `500` if there was a server issue (mail server, DB connection, etc.) or Gmail is not setup

**Code** : `400` if there was an issue with provided arguments (ex. incorrect security answer or invalid arguments).
**Content examples**

If the email could successfully be sent, the API will return:

```json
{
  "status": 200,
  "message": "Sent password reset PIN to user if they exist in the database."
}
```

## Verify Password Reset

Actually process the changed password. Returns the authenticated JWT if successful (user password has been changed in the database).

If Gmail is enabled, the PIN that was emailed to the user must be specified and valid (i.e. not expired).

If Gmail is not enabled, the user must send the answer to the security question (similar to `/forgotPassword`).

If neither Gmail nor security question are enabled, the server will raise an exception that will be logged to the console, and the endpoint will not send a response.

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

# Workflow

1. User navigates to some "forgot password" link on the frontend.

2. User enters email in the provided field.

3. Client makes a GET request to `/getSecurityQuestion?email=test@example.com`, and, if user exists, gets a securtiy question back.

4. User enters security question answer.

5. Makes a post request to the API which goes to the auth server
   - form encoded body with email and security question answer
   - doesn't need a JWT, isn't authenticated
     If Gmail is not enabled, skip to step 11 but sending a `/resetPassword` POST request with the security question rather than PIN.

6) Seaches for the user in the database, if it exists and the security question matches, it generates a pin and current database

7) In the user model sets the date field called "expiration" to that current date + 24 hours.

8) Sets the pin to the 7 digit code.

9) Using Nodemailer, it sends an email to the user if the user exists.

10) Will return a response based on whether the email was successfully sent to the user.

11) User enters PIN in a field in the client to reset password.

12) Client sends request to `/resetPassword` with the updated password, email, and PIN.

13) If all is successful, expiration is invalidated and password is changed. If not (email doesn't match, PIN is expired, etc.) then an error message will be returned to the client.
    User gets logged in with the returned JWT.

**_Not sure whether you want to use Security Questions? Make it an optional feature before the pin_**

- Set a default security question in the database (if the user doesnt exist)
- Field with every user for specific questions
- The dev team can choose questions, auth server handles everything.
- Config file can turn off this functionality

<img src={require('./forgotpassword-diagram.png')} style={{maxWidth:800}}></img>
