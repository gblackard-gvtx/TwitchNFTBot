require('dotenv').config()
const tmi = require('tmi.js');;
const fetch = require('node-fetch');

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: ['nonfungbot', 'tommybraccia']
});

client.connect();


const APP_CLIENT_ID = process.env.CLIENT;
const APP_CLIENT_SECRET = process.env.SECRET;
const APP_REFRESH_TOKEN = process.env.REFRESH;
const CHANNEL_BROADCAST_ID = process.env.BROADCASTID;


client.on('message', (channel, tags, message, self) => {
	if (self) return;

	if (message.toLocaleLowerCase() === '!clip.rarible') {

		const AWSEndpointCall = async () => {
			const response = await fetch('http://localhost:8080/');

			response.text().then(function (text) {
				client.say(channel, `@${tags.username}, lazy mint a Rarible token at ${text}`);
			})

		}
		AWSEndpointCall();
	}
});

