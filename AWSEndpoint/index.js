require('dotenv').config()
const axios = require('axios');

const APP_CLIENT_ID = process.env.CLIENT;
const APP_CLIENT_SECRET = process.env.SECRET;
const APP_REFRESH_TOKEN = process.env.REFRESH;
const CHANNEL_BROADCAST_ID = process.env.BROADCASTID;


async function getRefreshedAccessToken() {
const response =  await axios({
    method:'post',
    url: 'https://id.twitch.tv/oauth2/token',
    params:{
        grant_type: "refresh_token",
        refresh_token: APP_REFRESH_TOKEN,
        client_id: APP_CLIENT_ID,
        client_secret: APP_CLIENT_SECRET
    }
})
    let access_token = response.data.access_token
    return access_token;
};

async function createTwitchClip( accessToken ) {
    try {
        const response = await axios({
            method:'post',
            url:'https://api.twitch.tv/helix/clips',
            params:{
                has_delay: false,
                broadcaster_id: CHANNEL_BROADCAST_ID 
            },
            headers: 
            {
                "Authorization": "Bearer " + accessToken,
                    "Client-ID": APP_CLIENT_ID,
            }
        })
        let json = response.data;
            console.log(json);
    
            const clipData = json.data[0];
            const clipID = clipData.id;
            const clipURL = "https://clips.twitch.tv/" + clipID;
            console.log("create-twitch-clip-clip-data=", clipData);
            console.log("create-twitch-clip-clip-id=", clipID);
    
            return {
                clipID,
                clipURL,
            };
        
    } catch (error) {
        if( typeof error === "string" && error.indexOf("Clipping is not possible for an offline channel.") !== -1 ) {
            const newError = new Error("Someone tried to clip while the channel is offline :ugh:");
            throw newError;
        }

        throw error;
    }
}



const main = async (userName) => {
	let accessToken;
	let responseClipURL;
	let clipId;
	try {
		accessToken = await  getRefreshedAccessToken();
	} catch (error) {
		console.error("problem-fetching-access-token", error);
		return "Unexpected problem when fetching the access token.";
	}
    try {
        console.log("accesstoken", accessToken);

        const response = await createTwitchClip(accessToken);
        clipId = response.clipID;
        responseClipURL = response.clipURL;
        return  responseClipURL;

    } catch( error ) {

        console.error("problem-creating-clip", error);

        if( typeof error === "string" && error.indexOf("{") === 0 ) {

            error = JSON.parse(error);

            // Twitch broke =(
            if( error.error === "Service Unavailable" && error.status === 503 ) {
                return "Twitch API didn't want to create a clip right now, you need to manually create the clip :(";
            }

        }

        if( error.message === "Clipping is not possible for an offline channel"
            && error.status == 404 ) {
            return "I can't clip while the channel is offline :(";
        }

        return "Unexpected problem when creating the clip.";
    }
}
exports.handler = async (event) => {

    const username = event["queryStringParameters"] && event["queryStringParameters"]["user"];
    var rarible = event["queryStringParameters"] && event["queryStringParameters"]["rarible"];
    if (rarible == 'true') {
        rarible = true;
    }
    console.log("username", username);
    console.log("rarible", rarible);

    const message = await main(username);

    const response = {
        statusCode: 200,
        headers: {
            "content-type": "text/plain; charset=UTF-8"
        },
        body: message,
    };
    return response;

};