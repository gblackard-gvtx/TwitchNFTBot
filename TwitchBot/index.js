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
async function getRefreshedAccessToken() {
	const refreshToken = process.env.REFRESH;
	const clientId = process.env.CLIENT;
	const secret = process.env.SECRET;
	const response = await fetch(`https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${secret}`, {
		method: 'post'
	});
	const data = await response.json();
	console.log(data);
}

const main = async () => {
	let accessToken;
	let responseClipURL;
	let clipId;
	try {
		getRefreshedAccessToken();
	} catch (error) {
		console.error("problem-fetching-access-token", error);
		return "Unexpected problem when fetching the access token.";
	}
}
main();
