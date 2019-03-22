---
name: Google Authentication
route: /googleauth
---

import Box from '../box'
import Container from '../container'
import Arrow from '../arrow'
import ArrowUp from '../arrowUp'

# Google OAuth

Confused? Don't worry, me too.

## Some nice links:

Learn more about OAuth:

- [Frontend Button](https://www.npmjs.com/package/react-google-login)
- [OAuth 2.0](https://developers.google.com/identity/protocols/OAuth2)
- [OAuth Web](https://developers.google.com/identity/protocols/OAuth2WebServer)
- [Playground](https://developers.google.com/oauthplayground/)

Tutorial articles:

- [Medium article about google api](https://medium.com/@pablo127/google-api-authentication-with-oauth-2-on-the-example-of-gmail-a103c897fd98)
- [Medium article about express and oauth](https://medium.com/@bogna.ka/integrating-google-oauth-with-express-application-f8a4a2cf3fee)
- [Extract stuff](https://stackoverflow.com/questions/16501895/how-do-i-get-user-profile-using-google-access-token)

Reference code (credit to our precious goldfish codirector Timothy Ko):

- [LWB Frontend](https://github.com/hack4impact-uiuc/love-without-boundaries/blob/3c8ceb3d76c44ce15b8257cc147ae6cf3b092476/react_frontend/src/components/signin.js)
- [LWB Backend](https://github.com/hack4impact-uiuc/love-without-boundaries/blob/3c8ceb3d76c44ce15b8257cc147ae6cf3b092476/web_backend/src/index.js)

## Development:

- Google OAuth and Google API server
- Google button in Frontend
- Node-fetch and body-parser to handle endpoints and requests to Google servers
- Includes special checks in other endpoints to accomodate for lack of password in server.

## Diagrams and Data Flow:

### Backend

| Endpoint | /google [POST] (redirected from API to Server)      |
| :------- | :-------------------------------------------------- |
| body     | tokenId (in successful response from Google button) |
| response | message on success                                  |

- Client sends a login request to Google.
- Google authenticates everything, sends a token back. Client stores this token as cookies.
- Auth server stores a null password and a flag to signal a Google user.
- Token is passed around to the API/auth server to check permissions.
- Token is also passed back to Google auth to make sure nothing fishy is going on. They can also be cycled.

<Container orientation="column">
    <Container jC="space-between">
        <Box borderColor="black" text="Google"/>
        <Arrow inverseArrow={true} scale=".75">
            <div style={{padding: '.5rem'}}>
            </div>
        </Arrow>
        <Box borderColor="black" text="Auth"/>
    </Container>
    <Container jC={'space-between'}>
        <Container orientation="column">
            <Container>
            <ArrowUp scale=".5">
                <div style={{padding: '.5rem'}}>
                </div>
            </ArrowUp>
            </Container>
            <ArrowUp down={true} scale=".5">
                <div style={{padding: '.5rem'}}>
                </div>
            </ArrowUp>
            <Box borderColor="black" text="Client"/>
        </Container>
        <Container orientation="column">
            <Arrow scale=".75">
                <div style={{padding: '.5rem'}}>
                </div>
            </Arrow>
        </Container>
        <Container orientation="column">
            <Container>
            <ArrowUp scale=".5">
                <div style={{padding: '.5rem'}}>
                </div>
            </ArrowUp>
            </Container>
            <ArrowUp down={true} scale=".5">
                <div style={{padding: '.5rem'}}>
                </div>
            </ArrowUp>
            <Box borderColor="black" text="API"/>
        </Container>
    </Container>
    
</Container>

This is the token's path

- Response is a bunch of json with access token, ID token, refresh time, scope etc.

```
// Extract information of users from id_token. Other keys specify what's accessible and control security.
{
  "access_token": "ya29.Glu4BmEGS3Ih4RUjuVy4y-WvkjoqinV_dsYDcZMtVcRorzMJOdeRe_cwMaTeSdu1JJYuNwzM2F0MjVkRP984biER3dmAWfUJ6d6n1TubtkxXJXw23vhbnbMS_Zvj",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkNjgwZDhjNzBkNDRlOTQ3MTMzY2JkNDk5ZWJjMWE2MWMzZDVhYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTMwNzgzMDkxMDg5ODI1MTczODMiLCJhdF9oYXNoIjoiWDhJcmwwMThsNjdUQnVXU09YV0dsUSIsIm5hbWUiOiJNaWNoYWVsIENoZW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1yNFRQZGRxSzIyby9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ2V2b1FPT1F4YkNIMjhHNVpieE5aREZzY0lsWEdMZkl3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJNaWNoYWVsIiwiZmFtaWx5X25hbWUiOiJDaGVuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1NTA4ODI5NDksImV4cCI6MTU1MDg4NjU0OX0.EULSOQbn18m8qouRmGAYxbwwQbsAR-Wl2Cdr6CKsiCInINCtz11RMZJVx2nKrC-AMCaEta5acTPcKT-T3GpC4Y-p1uzvx3zKj0fwSwbw3bAmV_qVJP8Eh94zOl8LfpS0TTzDrS1mu0IjHtwLNaKfYs1_SR9n1GIFARXQ_tobDy-7E5UAkFCkvR-Y2_aPvFcLex0zV2hbDmjNG61hMyan2hxbkYAohzOQ2KJRsqBhk6YHnIadnCGDUhXTWhW2h--VRrUFVremIR2qBEOScnCQ8pZigNF0eT0MvPF6_x-p5P1KnSyeYEuEf61Hr8M8GUFl6te450iC8ZQnnnyiEP7KmA",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "https://www.googleapis.com/auth/profile.agerange.read openid https://www.googleapis.com/auth/profile.language.read https://www.googleapis.com/auth/userinfo.profile",
  "refresh_token": "1/xZPOF-F8QzfyCf65-3G4Dl-d-D8vZrCcb_NBBw-YkiY"
}
```

### Frontend

"Sign In With Google" button that links to Google/Auth server

<img src={require('./GButton.png')} width="150"/>

You know the great thing about buttons? They can be anywhere you want them to! :)

## Usage:

### What the Devs need to do:

- Enable whether or not to use this feature and have it appear on frontend.
  Hopefully won't have to do much else with their API.

### What the Users need to do:

| You                                           | Appropriate Response               |
| :-------------------------------------------- | :--------------------------------- |
| See Google button and want to use             | Move mouse. Click Button.          |
| See Google button and don't want to use       | Continue on like you never saw it. |
| Don't see Google button and want to use       | You're fucked.                     |
| Don't see Google button and don't want to use | Nothing happens.                   |
