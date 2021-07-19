const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require('dotenv').config()

const pinFileToIPFS = async (pinataApiKey, pinataSecretApiKey, filePath) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append("file", fs.createReadStream(filePath));
    console.log(data);
    const metadata = JSON.stringify({
        name: 'NotUsedNow',
        keyvalues: {
            exampleKey: 'TODO'
        }
    });
    data.append('pinataMetadata', metadata);
    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);
    let IpfsHash = "";

    await axios.post(url, data, {
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        },
    })
        .then(function (response) {
            console.log(
                response.data);
            console.log(IpfsHash);
            IpfsHash = response.data.IpfsHash;

        })
        .catch(function (error) {
            console.log(error.toJSON())
            IpfsHash = 'Failed';
        });
    return IpfsHash;
};

async function uploadFileAndGetIPFS() {
    console.log((await pinFileToIPFS(process.env.PINATA_KEY, process.env.PINATA_SECRET, "./assets/TestingVideo.mp4")).toString());
}

uploadFileAndGetIPFS();
