const https = require("https");

/*
 * Please add all the necessary values below
 * --------------------------------------------------
 */
const APP_CLIENT_ID = "";
const APP_CLIENT_SECRET = "";
const APP_REFRESH_TOKEN = "";
const DISCORD_WEBHOOK_ID = "";
const DISCORD_WEBHOOK_TOKEN = "";
const CHANNEL_BROADCAST_ID = "";
const DELAY_TO_POST_TO_DISCORD = 4 * 1000; // Twitch needs time to create the clip, so this defines how long time in ms until a message is posted to Discord


const POST_MESSAGE_TWITCH_CHAT = (discordUrl, raribleUrl) => {
    // It is possible to use channel emotes here, but the bot needs to be a subscriber
    if (raribleUrl) {
        return "The clip can be viewed at " + discordUrl + " and it can be purchased at " + raribleUrl;
    }
    return "The clip can be found at " + discordUrl;
};


const ERROR_TYPE_TWITCH_CHANNEL_OFFLINE = 1;

async function getRefreshedAccessToken() {

    const response = await doRequest(
        "POST",
        "id.twitch.tv",
        "/oauth2/token?grant_type=refresh_token&refresh_token=" + APP_REFRESH_TOKEN + "&client_id=" + APP_CLIENT_ID + "&client_secret=" + APP_CLIENT_SECRET,
        undefined,
        undefined
    );

    const json = JSON.parse(response);
    return json.access_token;

}

async function createTwitchClip(accessToken) {

    try {

        const response = await doRequest(
            "POST",
            "api.twitch.tv",
            "/helix/clips?has_delay=false&broadcaster_id=" + CHANNEL_BROADCAST_ID,
            undefined,
            {
                "Authorization": "Bearer " + accessToken,
                "Client-ID": APP_CLIENT_ID,
            }
        );

        const json = JSON.parse(response);
        console.log("create-twitch-clip-json", json);

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

        if (typeof error === "string" && error.indexOf("Clipping is not possible for an offline channel.") !== -1) {
            const newError = new Error("Someone tried to clip while the channel is offline :ugh:");
            newError.type = ERROR_TYPE_TWITCH_CHANNEL_OFFLINE;
            throw newError;
        }

        throw error;

    }

}

function doRequest(method, hostname, path, postData, headers) {
    return new Promise((resolve, reject) => {

        const options = {
            method,
            hostname,
            path,
            port: 443,
            headers,
        };

        const request = https.request(options, (response) => {

            response.setEncoding("utf8");
            let returnData = "";

            response.on("data", (chunk) => {
                returnData += chunk;
            });

            response.on("end", () => {

                if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(returnData);
                } else {
                    resolve(returnData);
                }

            });

            response.on("error", (error) => {
                reject(error);
            });

        });

        if (postData) {
            request.write(postData);
        }

        request.end();
    });

}

function wait(time) {
    console.log("waiting");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("wait done");
            resolve();
        }, time);
    });
}

async function main(username, rarible) {

    let accessToken;
    let responseClipURL;
    let messageDiscord;

    try {
        accessToken = await getRefreshedAccessToken();
    } catch (error) {
        console.error("problem-fetching-access-token", error);
        return "Unexpected problem when fetching the access token.";
    }

    try {
        console.log("accesstoken", accessToken);

        const response = await createTwitchClip(accessToken);
        const clipID = response.clipID;
        responseClipURL = response.clipURL;

        await wait(DELAY_TO_POST_TO_DISCORD);

    } catch (error) {

        console.error("problem-creating-clip", error);

        if (typeof error === "string" && error.indexOf("{") === 0) {

            error = JSON.parse(error);

            // Twitch broke =(
            if (error.error === "Service Unavailable" && error.status === 503) {
                return "Twitch API didn't want to create a clip right now, you need to manually create the clip :(";
            }

        }

        if (error.type === ERROR_TYPE_TWITCH_CHANNEL_OFFLINE) {
            return "I can't clip while the channel is offline :(";
        }

        return "Unexpected problem when creating the clip.";
    }
    let raribleUrl = '';
    try {
        // TODO: Below.
        // Return the URL to the chat of the clip.
        // Also if Rarible is true then upload it to Rarible.
    } catch (error) {
        console.error("problem-sending-to-discord", error);
        return "Unexpected problem when posting to Discord.";
    }

    try {
        const messageWeb = POST_MESSAGE_TWITCH_CHAT(responseClipURL,);
        return messageWeb;
    } catch (error) {
        console.error("problem-getting-twitch-chat-response", error);
        return "Unexpected problem getting response to Twitch chat";
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

    //const message = await main(username);

    const response = {
        statusCode: 200,
        headers: {
            "content-type": "text/plain; charset=UTF-8"
        },
        body: message,
    };
    return response;

};