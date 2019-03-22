---
name: Login and Logout
route: /loginandlogout
---

# Login and Logout

## Endpoints

| Endpoint | /login [POST] (redirected from API to Server)                     |
| -------- | ----------------------------------------------------------------- |
| body     | email, hashed password                                            |
| response | message: success/error, jwt token if the account is authenticated |

## Login Workflow

### Step 1: Filling out the form on the client side

This includes fields for

- email or username
- password (twice for good measure)
- an option to sign up using their google accounts<br />

The provided form provided for the login is also a default form you can use. Similar to the signup section, integration with the authentication server can be done through these methods:

- customizing the default component
- creating a new component altogether to plug into the server

### Step 2: Sends the login request to the API, redirected by the API to the authentication server.

A request will be made to your API, which will then be redirected to the authentication server. <br />
The authentication server by checking these fields:

- username
- password (hashed)

If the information is **validated** (more in next section), the server will send a success message and the jwt token containing the user id and permission level to the API.
If it is invalid, we will send an error message that the dev team can display for user notice.
The API will check for all other required login fields. All of these customizations canb e specified in the config file.

### Step 3: Authentication Server Validation

For logging in, we will validate a few things:

- password matches
- email is verified

### Step 4: Authentication Server Response

If valid, the authentication server will encrypt a jwt token that contains the user id and permision level, and send it back to the API.

### Step 5: API Response

If valid, the API will respond to the client with a success message and the jwt token sent from the Authentication Server. This token is storred in cookies and sent with every request.

## Logout Workflow

Step 1: Delete the jwt token from cookies
