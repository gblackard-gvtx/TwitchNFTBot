const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { url } = require("inspector");
const fetch = require("node-fetch");
const ethers = require('ethers')
const TypedDataUtils = require('ethers-eip712');
const { type } = require("os");
const privateUtil = require("ethereumjs-util");
const signTypedData_v4 = require("eth-sig-util");
const { sign } = require("crypto");

require('dotenv').config()

async function getWallet() {
    let json = JSON.stringify(
        { "version": 3, "id": "6912a15b-c2b1-452b-a93c-bdedbace7841", "address": "afa4f9a3ff1c73f64bea02cdc74fdd7f89d91822", "crypto": { "ciphertext": "6340d22c68f11bb755edcfe79bb813f03e8b5738c666ed91311637bec3348d7e", "cipherparams": { "iv": "00bc7bc1afb65bdb11b326bb4f2b9846" }, "cipher": "aes-128-ctr", "kdf": "scrypt", "kdfparams": { "dklen": 32, "salt": "18ac28d5b7e6ad4fb059eba905b87c4b1b768a84c4f5620fa62f2b15ca7f2b27", "n": 262144, "r": 8, "p": 1 }, "mac": "54c7178968e3c8d5d321d5746006dae1774505a64664d1c98dee26e2d9e4719d" } });
    let password = "pass";
    let wallet = await ethers.Wallet.fromEncryptedJson(json, password)
    console.log(wallet.address);
    return wallet;
}
const pinFileToIPFS = async (pinataApiKey, pinataSecretApiKey, filePath, metadataPassed) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append("file", fs.createReadStream(filePath));
    console.log(data);
    const metadata = JSON.stringify(metadataPassed);
    console.log(metadataPassed);
    data.append('pinataMetadata', metadata);
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
            console.log('failed')
            IpfsHash = 'Failed';
        });
    return IpfsHash;
};
async function generateTokenId(ContractAddress, userAddress) {
    let tokenInformation = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/collections/${ContractAddress}/generate_token_id?minter=${userAddress}`).then(res => res.json());
    return tokenInformation.tokenId;


}
function generatelazyMintRequestBody(tokenId, contractAddress, IpfsHash, creatorAddress) {
    let body = {
        "@type": "ERC721",
        contract: contractAddress,
        tokenId: tokenId,
        uri: `/ipfs/${IpfsHash}`,
        creators: [
            {
                account: creatorAddress,
                value: "10000"
            }
        ],
        royalties: [
        ],
    };
    return body;
}
function generateTypedDataStructure(contractAddress, body) {

    let ds = {
        types: {
            EIP712Domain: [
                {
                    type: "string",
                    name: "name",
                },
                {
                    type: "string",
                    name: "version",
                },
                {
                    type: "uint256",
                    name: "chainId",
                },
                {
                    type: "address",
                    name: "verifyingContract",
                }
            ],
            Mint721: [
                { name: "tokenId", type: "uint256" },
                { name: "uri", type: "string" },
                { name: "creators", type: "Part[]" },
                { name: "royalties", type: "Part[]" }
            ],
            Part: [
                { name: "account", type: "address" },
                { name: "value", type: "uint96" }
            ]
        },
        domain: {
            name: "Mint721",
            version: "3",
            chainId: 3,
            verifyingContract: contractAddress
        },
        primaryType: "Mint721",
        message: body

    };
    return ds;
}
function extractAddress(privateKey) {
    return `0x${privateUtil.privateToAddress(Buffer.from(privateKey, "hex")).toString("hex")}`
}
async function signTypedData(walletPrivateKey, dataStructure, wallet) {

    const digest = TypedDataUtils.TypedDataUtils.encodeDigest(dataStructure)
    console.log(digest);
    const signature = await wallet.signMessage(digest)
    console.log(signature);
    return signature;
}
async function uploadToRarible(lazyMintRequestBody, signature) {
    lazyMintRequestBody.signatures = [signature];
    console.log(lazyMintRequestBody);
    axios.post('https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/mints', lazyMintRequestBody)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
function generateIPFSMetadata(userAddress, tokenId, hash) {
    let metaData = {
        "name": `tempTwo`,
        "description": `temp desc`,
        "image": `ipfs://ipfs/${hash}`,
        "external_url": `https://app.rarible.com/${userAddress.substring(0, 20)}:${tokenId}` /* This is the link to Rarible which we currently don't have, we can fill this in shortly */,
        "animation_url": 'https://google.com'/* IPFS Hash just as image field, but it allows every type of multimedia files. Like mp3, mp4 etc */,
        // the below section is not needed.
        "attributes": [
            {
                "key": '?here' /* Key name - This must be a string */,
                "trait_type": '?here?' /* Trait name - This must be a string */,
                "value": '?here'/* Key Value - This must be a string */
            }
        ]
    }
    return metaData;
}
async function uploadAndMintAFile(userAddress, username, gameTitle) {
    // Rinkeby ERC721 Contract Address is 0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05
    let contractAddress = '0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05';
    let tokenId = await generateTokenId(contractAddress, userAddress);
    let hash = await pinFileToIPFS(process.env.PINATA_KEY, process.env.PINATA_SECRET, "./assets/3MBTestingVideo.mp4", { "name": "temhjghghjvfghp" });
    let metadata = generateIPFSMetadata(userAddress, tokenId, hash);
    // Updates the IPFS Metadata
    hash = await pinFileToIPFS(process.env.PINATA_KEY, process.env.PINATA_SECRET, "./assets/3MBTestingVideo.mp4", metadata);
    let lazyMintRequestBody = generatelazyMintRequestBody(tokenId, contractAddress, hash, userAddress);
    console.log(lazyMintRequestBody);
    let typedDataStructure = generateTypedDataStructure(contractAddress, lazyMintRequestBody);
    console.log(lazyMintRequestBody);
    console.log(typedDataStructure);
    console.log(typedDataStructure.message);
    let wallet = await getWallet();
    let signature = await signTypedData(process.env.TORUS_WALLET_PRIVATE_KEY, typedDataStructure, wallet);
    console.log(signature);
    await uploadToRarible(lazyMintRequestBody, signature);


}
uploadAndMintAFile('0xAFa4f9a3fF1c73f64BeA02CDc74FDd7F89D91822', 'SampleUsername', 'SampleGameName');
