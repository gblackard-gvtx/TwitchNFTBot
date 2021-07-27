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
			const response = await fetch('http://ec2-18-221-33-66.us-east-2.compute.amazonaws.com:8080/');
			response.text().then(function (text) {
				client.say(channel, `@${tags.username}, ${text}`);
			})

		}
		AWSEndpointCall();
	}
});

