# Clint Bot - Twitch
To give credit to where credit is due, I used following documentation as a jumping off point for the twitch APIs [creating a !clip command](https://www.specialagentsqueaky.com/blog-post/8gkvc50n/2020-06-17-how-i-created-clip-command-for-twitch-clips/#step-2-registering-a-twitch-application) before writing my own documentation, as not everything is his article is needed. 

-----------------------------------------------------------------------------------------------------------------------------------
## Step 1: Registering a Twitch application

To be able to clip your steam programmatically you must first register your app with Twitch.
* To register your app go to the [Developer Dashboard](https://dev.twitch.tv/login). Login and click "Register Your App"
* Name your app based on the project. For the "OAuth Redirect URL" type in "http://localhost/". As discussed above this is very important step.
* Select "Application Integration"
* Click back into the application and you will see both the application's "Client ID" and "Secret". Copy and save these for later

    __NOTE: Both the "Client ID" and the "Secret", is sensitive information, so do not share them with anyone.__
    
    
    
## Step 2: Giving your application the rights to clip

* In your preferred browser paste in the following 
```
https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=##CLIENT_ID##&redirect_uri=http://localhost/&scope=clips:edit
```
* Make sure you replace the ##CLIENT_ID## with your application's "Client ID" from above.
* You will be asked to authorize the your app. Click "Authorize".
* Twitch will redirect us to "http://localhost/" - which probably will look like a broken page.
* In the URL of the broken looking page copy the alphanumeric code between code= and &scope.
* Save this code for late, and be sure not to share it with anyone. This is the "Authorization Code" we were looking for.
    
    
    
## Step 3: Getting Refresh Token

Twitch gives you an Access Token, but then requires a Refresh Token to update that Access Token.
The easiest way to get the Refresh Token is to us a Post request either with Postman or Insomnia.
```
curl --request POST \
    --url 'https://id.twitch.tv/oauth2/token?   client_id=##CLIENTID##&client_secret=##SECRET##&code=##AUTHCODE##&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost%2F' 
    --header 'Content-type: application/json' \
```
This request returns the following Json response.
```javascript
{
  "access_token": "0123456789abcdefghijABCDEFGHIJ",
  "refresh_token": "eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj",
  "expires_in": 3600,
  "scope": "channel:read:subscriptions",
  "token_type": "bearer"
}
```
Save this refresh token for later.

__Please Note:__
Learn from my repeat mistakes and only run this GET request one time to get the refresh token. If you run this again it will force you to repeat the steps of getting the Authorization Code.
Once you have the Refresh code you will use the following request to refresh you access token from now on.
```
curl --request POST \
  --url 'https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=###REFRESHTOKEN###&client_id=###CLIENTID###&client_secret=###SECRET###' \
```



## Step 4: Get BroadcasterID

Next we need to get the broadcasterId from twitch.
Just like last time we can us Postman or Insomnia. You can use the following CURL Command.
You will need your Access Token and Client ID.
```
curl --request GET \
  --url https://api.twitch.tv/helix/users \
  --header 'Authorization: Bearer Access Token' \
  --header 'Client-Id: ClientID' \
```
This request returns the following Json response.
```javascript
{
  "data": [
    {
      "id": "",
      "login": "",
      "display_name": "",
      "type": "",
      "broadcaster_type": "",
      "description": "",
      "profile_image_url": "",
      "offline_image_url": "",
      "view_count": ,
      "created_at": ""
    }
  ]
}
```
We want the id and the login from this json object.
At this point and time you should have the following variables.
* ClientId
* Secret
* Authorization Code
* Refresh Token
* BroadcastId
* Login

# Twitch chatbot setup

##  Twitch Oauth Token

You will need to get an Oauth token to allow your chatbot to communicate with the twitch server. You can Generate the token with the following link: [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/) Make sure you are logged in to your chatbot account. The token will be an alphanumeric string.

From here you can follow the twitch documentation to build your chatbot
[Getting Started with Chat & Chatbots](https://dev.twitch.tv/docs/irc).

------------------------------------------------------------------------------------------------------------------------------------------------
