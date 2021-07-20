const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { url } = require("inspector");
const fetch = require("node-fetch");

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

            IpfsHash = response.data.IpfsHash;

        })
        .catch(function (error) {
            console.log(error.toJSON())
            IpfsHash = 'Failed';
        });
    return IpfsHash;
};
async function generateTokenId(ContractAddress, userAddress) {
    let tokenInformation = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/collections/${ContractAddress}/generate_token_id?minter=${userAddress}`).then(res => res.json());
    return tokenInformation.tokenId;


}
function generateLazyMintRequestBody(tokenId, contractAddress, IpfsHash, creatorAddress) {
    let body = {
        "@type": "ERC721",
        "contract": contractAddress,
        "tokenId": tokenId,
        "uri": `/ipfs/${IpfsHash}`,
        "creators": [
            {
                account: contractAddress,
                value: "10000"
            }
        ],
        "royalties": [
            {
                account: contractAddress,
                value: 2000
            }
        ],
    };
    return body;
}
async function uploadAndMintAFile(userAddress, username, gameTitle) {
    // Rinkeby ERC721 Contract Address is 0x6ede7f3c26975aad32a475e1021d8f6f39c89d82
    let contractAddress = '0x6ede7f3c26975aad32a475e1021d8f6f39c89d82';
    let hash = await pinFileToIPFS(process.env.PINATA_KEY, process.env.PINATA_SECRET, "./assets/3MBTestingVideo.mp4");
    let tokenId = await generateTokenId(contractAddress, userAddress);
    let LazyMintRequestBody = generateLazyMintRequestBody(tokenId, contractAddress, hash, userAddress);
    console.log(genereatedRaribleURL.tokenId);


    let metaData = {
        "name": `${username} recording at ${Date.now().toString()}`,
        "description": `A recording of ${username} playing ${gameTitle} at ${Date.now().toString()}`,
        "image": `ipfs://ipfs/${hash}`,
        "external_url": genereatedRaribleURL /* This is the link to Rarible which we currently don't have, we can fill this in shortly */,
        "animation_url": '?here'/* IPFS Hash just as image field, but it allows every type of multimedia files. Like mp3, mp4 etc */,
        // the below section is not needed.
        "attributes": [
            {
                "key": '?here' /* Key name - This must be a string */,
                "trait_type": '?here?' /* Trait name - This must be a string */,
                "value": '?here'/* Key Value - This must be a string */
            }
        ]
    }
}
uploadAndMintAFile('0xAFa4f9a3fF1c73f64BeA02CDc74FDd7F89D91822', 'SampleUsername', 'SampleGameName');
