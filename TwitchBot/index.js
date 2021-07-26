require('dotenv').config()
const tmi = require('tmi.js');;
const fetch = require('node-fetch');

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: ['nonfungbot']
});

client.connect();


const APP_CLIENT_ID = process.env.CLIENT;
const APP_CLIENT_SECRET = process.env.SECRET;
const APP_REFRESH_TOKEN = process.env.REFRESH;
const CHANNEL_BROADCAST_ID = process.env.BROADCASTID;


client.on('message', (channel, tags, message, self) => {
	if (self) return;

	if (message.toLocaleLowerCase() === '!clip.openseas') {

		const AWSEndpointCall = async () => {
			const response = await fetch('https://167u5tt2o0.execute-api.us-east-2.amazonaws.com/default/Endpoint');
			response.text().then(function (text) {
				client.say(channel, `@${tags.username}, ${text}`);
			})

		}
		AWSEndpointCall();
	}
});

