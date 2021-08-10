const Web3 = require('Web3');
require('dotenv').config();

const rpcURL = 'https://mainnet.infura.io/' + process.env.WEB3_INFURA_PROJECT_ID;

const address = '0x75E3ef350D913d71278d2Fc44414A5985A28B1b3';

const web3 = new Web3(rpcURL);
;
async function getBalance(){web3.eth.getBalance(address, (err, wei) => {
    balance = web3.utils.fromWei(wei, 'ether')
  })}

const main