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