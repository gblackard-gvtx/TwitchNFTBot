const Web3 = require("web3");
require("dotenv").config();
const axios = require("axios");

let ipfsHash =
  "ipfs://ipfs/" +
  "bafybeigpgh7aty2amsiaj24jgpvn7nhp6nnqijtpcvj5tvdre6iyamvtla";
const abi = {
  inputs: [
    {
      components: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "uri",
          type: "string",
        },
        {
          components: [
            {
              internalType: "address payable",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          internalType: "struct LibPart.Part[]",
          name: "creators",
          type: "tuple[]",
        },
        {
          components: [
            {
              internalType: "address payable",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          internalType: "struct LibPart.Part[]",
          name: "royalties",
          type: "tuple[]",
        },
        {
          internalType: "bytes[]",
          name: "signatures",
          type: "bytes[]",
        },
      ],
      internalType: "struct LibERC721LazyMint.Mint721Data",
      name: "data",
      type: "tuple",
    },
    {
      internalType: "address",
      name: "to",
      type: "address",
    },
  ],
  name: "mintAndTransfer",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

const rpcURL = process.env.WEB3_INFURA_RPCURL;
const contractAddress = process.env.RARI_ERC721_RINK_AD;

const walletAddress = "0x90e63c3d53E0Ea496845b7a03ec7548B70014A91";

const web3 = new Web3(rpcURL);

let tokenURL =
  "https://api-staging.rarible.com/protocol/v0.1/ethereum/nft/collections/" +
  contractAddress +
  "/generate_token_id?minter=" +
  walletAddress;

async function getTokenId(tokenURL) {
  try {
    const response = await axios.get(tokenURL);
    return response.data.tokenId;
  } catch (error) {
    console.error(error);
  }
}
const main = async () => {
  let tokenID = await getTokenId(tokenURL);
  console.log(tokenID);

  const dataStruct = JSON.stringify({
    types: {
      EIP712Domain: [
        {
          type: "string",
          name: "name"
        },
        {
          type: "string",
          name: "version"
        },
        {
          type: "uint256",
          name: "chainId"
        },
        {
          type: "address",
          name: "verifyingContract"
        },
      ],
      Part: [
        {name: 'account', type: 'address'},
        {name: 'value', type: 'uint96'}
      ],
      Mint721: [
        {name: 'tokenId', type: 'uint256'},
        {name: 'tokenURI', type: 'string'},
        {name: 'creators', type: 'Part[]'},
        {name: 'royalties', type: 'Part[]'}
      ]
    },
    domain: {
      chainId: 4,
      name: "Rarible Lazy Mint",
      verifyingContract: contractAddress,
      version: "1",
    },
    message: {
      "@type": "ERC721",
      contract: contractAddress,
      tokenId: tokenID,
      "uri": ipfsHash,
      creators: [
        {
          account: walletAddress,
          value: "10000",
        },
      ],
      royalties: [
        {
          account: walletAddress,
          value: 2000,
        },
      ],
    },
  });
  var from = walletAddress;

  var params = [from, dataStruct];
  var method = 'eth_signTypedData_v4';
  web3.currentProvider.sendAsync(
    {
      method,
      params,
      from,
    },
    function (err, result) {
      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
      }
      if (result.error) return console.error('ERROR', result);
      console.log('TYPED SIGNED:' + JSON.stringify(result.result));

      const recovered = sigUtil.recoverTypedSignature_v4({
        data: JSON.parse(msgParams),
        sig: result.result,
      });

      if (
        ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)
      ) {
        alert('Successfully recovered signer as ' + from);
      } else {
        alert(
          'Failed to verify signer when comparing ' + result + ' to ' + from
        );
      }
    }
  );
  const lazyMintBody = {
    "@type": "ERC721",
    contract: contractAddress,
    tokenId: tokenID,
    " uri": ipfsHash,
    creators: [
      {
        account: walletAddress,
        value: "10000",
      },
    ],
    royalties: [
      {
        account: walletAddress,
        value: 2000,
      },
    ],
    signatures: [],
  };
};
main()


