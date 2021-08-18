# TwitchNFTBot
Originally followed along with [How I created a !clip command that automatically created a Twitch clip and posted it to my Discord (using AWS Lambdas)](https://www.specialagentsqueaky.com/blog-post/8gkvc50n/2020-06-17-how-i-created-clip-command-for-twitch-clips/#step-2-registering-a-twitch-application) before writing my own documentation, as not everything is his areticle is needed. 
Step 1: Registering a Twitch application
    *To be able to clip your steam programatically you must first register your app with Twitch.
    *To register your app go to the [Developer Dashboard](https://dev.twitch.tv/login). Login and click "Register Your App"
    *Name your app based on the project. For the "OAuth Redirect URL" type in "http://localhost/". As discussed above this is very important step.
    *Select "Application Integration"
    *Click back into the application and you will see both the application's "Client ID" and "Secret". Copy and save these for later
    *NOTE:Both the "Client ID" and the "Secret", is sensitive information, so do not share them with anyone.
Step 2: Giving your application the rights to clip
    *In your preffered browser paste in the following "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=##CLIENT_ID##&redirect_uri=http://localhost/&scope=clips:edit" Make sure you replace the ##CLIENT_ID## with your application's "Client ID" from above.
    *You will be asked to authorize the your app. Click "Authorize".
    *Twitch will redirect us to "http://localhost/" - which probably will look like a broken page.
    *In the URL of the broken looking page copy the alphnumeric code between code= and &scope.
    *Save this code for late, and besure not to share it with anyone. This is the "Authorization Code" we were looking for.
Step 3: Getting Refresh Token
    Twitch gives you an Access Token, but then requires a Refresh Token to update that Access Token.
    The easiest way to get the Refresh Token is to us a Post request either with Postman or Insomnia.
    curl --request POST \
  --url 'https://id.twitch.tv/oauth2/token?client_id=##CLIENTID##&client_secret=##SECRET##&code=##AUTHCODE##&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost%2F' \
  --header 'Content-type: application/json' \
  --cookie 'server_session_id=ff0eb563e28c488aa5022b20882815b6; unique_id=jUFXU2fbn2ATIQogeyS2GGlmJwEI10ea; unique_id_durable=jUFXU2fbn2ATIQogeyS2GGlmJwEI10ea; twitch.lohp.countryCode=US'
