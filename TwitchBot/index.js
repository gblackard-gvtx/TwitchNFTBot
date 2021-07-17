require('dotenv').config()
const tmi = require('tmi.js');

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: ['airaden']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if (self) return;

	if (message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		client.say(channel, `@${tags.username}, heya!`);
	}

	if (message.toLocaleLowerCase() === '!dice') {
		const num = rollDice();
		client.say(channel, `@${tags.username}, You rolled a ${num}`);
	}
});

const rollDice = () => {
	const sides = 6;
	return Math.floor(Math.random() * sides) + 1;
}