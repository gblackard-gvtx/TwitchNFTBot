require('dotenv').config()
const tmi = require('tmi.js');

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.BOT_USERNAME ,
		password: process.env.OAUTH_TOKEN
	},
	channels: [ 'nonfungbot' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		client.say(channel, `@${tags.username}, heya!`);
	}

    if(message.toLocaleLowerCase() === '!dice'){
        const num = rollDice();
        client.say(channel, `@${tags.username}, You rolled a ${num}`);

    }
	if (message.toLocaleLowerCase()=== '!clip') {
		const userAction = async () => {
			const response = await fetch('https://usr9herp2j.execute-api.us-east-2.amazonaws.com/default/NFTClipTwitch%27');
			const myJson = await response.json(); //extract JSON from the http response
		   console.log(myJson);
		  }
	
	}
});

const rollDice =()=>{
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

