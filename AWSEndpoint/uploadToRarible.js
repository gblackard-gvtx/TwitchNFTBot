const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require('dotenv').config()

const pinFileToIPFS = async (pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    let data = new FormData();

    data.append("file", fs.createReadStream("./1Dot5TestingVideo.mp4"));
    console.log(data);
    return await axios.post(url, data, {
        headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        },
    })
        .then(function (response) {
            console.log(
                'Response is: ' + JSON.stringify(response.data));

        })
        .catch(function (error) {
            console.log('failed');
            console.log(error)
        });
};
pinFileToIPFS(process.env.PINATA_KEY, process.env.PINATA_SECRET);
/*
var data = JSON.stringify({ "name": "Test NFT", "description": "Test NFT", "image": "ipfs://ipfs/QmW4P1Mgoka8NRCsFAaJt5AaR6XKF6Az97uCiVtGmg1FuG/image.png", "external_url": "https://app.rarible.com/0x60f80121c31a0d46b5279700f9df786054aa5ee5:123913", "attributes": [{ "key": "Test", "trait_type": "Test", "value": "Test" }] });

var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    headers: {
        'pinata_api_key': // KEY_HERE,
            'pinata_secret_api_key': // SECRET_KEY_HERE,
        'Content-Type': 'application/json'
    },
    data: data
};

axios(config).then(function (response) {
    console.log(JSON.stringify(response.data));
}).catch(function (error) {
    console.log(error);
});*/