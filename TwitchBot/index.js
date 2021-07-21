require('dotenv').config()
const tmi = require('tmi.js');;
const fetch = require('node-fetch');

/*const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: ['nonfungbot']
});

client.connect();
*/

const APP_CLIENT_ID = process.env.CLIENT;
const APP_CLIENT_SECRET = process.env.SECRET;
const APP_REFRESH_TOKEN = process.env.REFRESH;
const CHANNEL_BROADCAST_ID = process.env.BROADCASTID;
console.log(APP_CLIENT_ID)
console.log(APP_CLIENT_SECRET)
console.log(APP_REFRESH_TOKEN)

client.on('message', (channel, tags, message, self) => {
	if (self) return;

	if (message.toLocaleLowerCase() === '!clip') {
		const AWSEndpointCall = async () => {
			const response = await fetch('https://167u5tt2o0.execute-api.us-east-2.amazonaws.com/default/Endpoint');
			const myJson = await response.json(); //extract JSON from the http response}
			client.say(channel, `@${tags.username}, ${JSON.stringify(myJson)}`);
		}
		AWSEndpointCall();
	} else if (message.toLocaleLowerCase() === '!clip.rarible') {
		const AWSEndpointCall = async () => {
			const response = await fetch('https://167u5tt2o0.execute-api.us-east-2.amazonaws.com/default/Endpoint?rarible=true');
			const myJson = await response.json(); //extract JSON from the http response}
			client.say(channel, `@${tags.username}, ${JSON.stringify(myJson)}`);
		}
	}
});

