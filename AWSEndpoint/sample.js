const fetch = require("node-fetch");

console.log("Calling the AWS Lambda Endpoint and printing the response:");
const sampleAWSEndpointCall = async () => {
    const response = await fetch('https://usr9herp2j.execute-api.us-east-2.amazonaws.com/default/NFTClipTwitch');
    const myJson = await response.json(); //extract JSON from the http response}
    console.log(myJson);
}
sampleAWSEndpointCall();