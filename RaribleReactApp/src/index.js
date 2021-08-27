import MetaMaskOnboarding from '@metamask/onboarding';
const EIP712 = require("./utilsLazyMint/EIP712");
const urlParams = new URLSearchParams(window.location.search);
const metaIPFS = urlParams.get('metaIpfs');
const videoIPFS = urlParams.get('videoIpfs');
var video = document.getElementById('video');
if (videoIPFS) {
  var source = document.createElement('source');

  source.setAttribute('src', 'https://gateway.pinata.cloud/ipfs/' + videoIPFS + '?filename=test.mp4');

  video.appendChild(source);
} else {
  video.style.display = "none";
}
console.log('meta is' + metaIPFS);
console.log('video is' + videoIPFS);
// eslint-disable-next-line camelcase
import {
  recoverTypedSignature_v4 as recoverTypedSignatureV4,
} from 'eth-sig-util';
import { ethers } from 'ethers';
import { toChecksumAddress } from 'ethereumjs-util';


let ethersProvider;

const currentUrl = new URL(window.location.href);
const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined;

const { isMetaMaskInstalled } = MetaMaskOnboarding;

// Dapp Status Section
const networkDiv = document.getElementById('network');
const chainIdDiv = document.getElementById('chainId');
const accountsDiv = document.getElementById('accounts');

// Basic Actions Section
const onboardButton = document.getElementById('connectButton');
const getAccountsButton = document.getElementById('getAccounts');
const getAccountsResults = document.getElementById('getAccountsResult');
const signTypedDataV4 = document.getElementById('signTypedDataV4');
const signTypedDataV4Result = document.getElementById('signTypedDataV4Result');


// Miscellaneous
const addEthereumChain = document.getElementById('addEthereumChain');
const switchEthereumChain = document.getElementById('switchEthereumChain');

const initialize = async () => {
  try {
    // We must specify the network as 'any' for ethers to allow network changes
    ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  } catch (error) {
    console.error(error);
  }

  let onboarding;
  try {
    onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }

  let accounts;
  let accountButtonsInitialized = false;

  const accountButtons = [signTypedDataV4];

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';

    onboardButton.disabled = true;
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };



  const updateButtons = () => {
    const accountButtonsDisabled =
      !isMetaMaskInstalled() || !isMetaMaskConnected();
    if (accountButtonsDisabled) {
      for (const button of accountButtons) {
        button.disabled = true;
      }
    } else {
      signTypedDataV4.disabled = false;
    }

    if (isMetaMaskInstalled()) {
      addEthereumChain.disabled = false;
      switchEthereumChain.disabled = false;
    } else {
      onboardButton.innerText = 'Click here to install MetaMask!';
      onboardButton.onclick = onClickInstall;
      onboardButton.disabled = false;
    }

    if (isMetaMaskConnected()) {
      onboardButton.innerText = 'Connected';
      onboardButton.disabled = true;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      onboardButton.innerText = 'Connect';
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }
  };

  getAccountsButton.onclick = async () => {
    try {
      const _accounts = await ethereum.request({
        method: 'eth_accounts',
      });
      getAccountsResults.innerHTML =
        _accounts[0] || 'Not able to get accounts';
    } catch (err) {
      console.error(err);
      getAccountsResults.innerHTML = `Error: ${err.message}`;
    }
  };

  const initializeAccountButtons = () => {
    if (accountButtonsInitialized) {
      return;
    }
    accountButtonsInitialized = true;

    /**
     * Contract Interactions
     */
  };
  async function putLazyMint(form) {
    console.log('compare put to lazy mint');
    console.log(JSON.stringify(form));
    const raribleMintUrl = "https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/mints"
    let returnable = [];
    const raribleMintResult = await fetch(raribleMintUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('The response was');
      // `data` is the parsed version of the JSON returned from the above endpoint.
      console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
      returnable = data;
    });

    console.log({ raribleMintResult })
    return returnable;
  }
  async function generateTokenId(contract, minter) {
    console.log("generating tokenId for", contract, minter)
    const raribleTokenIdUrl = `https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/collections/${contract}/generate_token_id?minter=${minter}`;
    const res = await fetch(raribleTokenIdUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJson = await res.json();
    console.log({ resJson })
    return resJson.tokenId
  }
  /**
   * Sign Typed Data V4
   */
  let verefiableTokenId = '';
  const walletAddress = "0x985A1A1A76dE1A98878e00F36Da673C5b1c9b25e";
  async function getRaribleTokenMsg(verefiableTokenIdTwo) {

    let ipfsHash = "/ipfs/" + (metaIPFS ? metaIPFS : 'QmU5YYRRSKsfZtbXdgEUGX89Ej4xmdVPzGnNckbMtvFhez');
    console.log('ipfs Hash being minted is ' + ipfsHash)
    let contractAddress = '0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05';

    let tokenID = verefiableTokenIdTwo;
    if (tokenID == undefined || tokenID == '') {
      tokenID = await generateTokenId(contractAddress, walletAddress);
      verefiableTokenId = tokenID;
      console.log(verefiableTokenId);
    }
    console.log(tokenID);
    const dataStruct = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Mint721: [
          { name: "tokenId", type: "uint256" },
          { name: "tokenURI", type: "string" },
          { name: "creators", type: "Part[]" },
          { name: "royalties", type: "Part[]" }
        ],
        Part: [
          { name: "account", type: "address" },
          { name: "value", type: "uint96" }
        ],
      },
      domain: {
        chainId: 3,
        name: 'Mint721',
        verifyingContract: contractAddress,
        version: '1',
      },
      primaryType: 'Mint721',
      message: {
        '@type': 'ERC721',
        'contract': contractAddress,
        'tokenId': tokenID,
        'uri': ipfsHash,
        'creators': [
          {
            account: walletAddress,
            value: '10000',
          },
        ],
        'royalties': [

        ],
        'tokenURI': ipfsHash,
      },
    };
    const dataStructSimple = {
      '@type': 'ERC721',
      'contract': contractAddress,
      'tokenId': tokenID,
      'uri': ipfsHash,
      'creators': [
        {
          account: walletAddress,
          value: '10000',
        },
      ],
      'royalties': [

      ],
    };
    console.log(dataStruct);
    return [dataStructSimple, dataStruct];
  }
  signTypedDataV4.onclick = async () => {
    // Get Rarible Token:
    let msgs = await getRaribleTokenMsg();
    let msg = msgs[1];
    let dataTwo = msgs[0];
    const networkId = parseInt(networkDiv.innerHTML, 10);
    const chainId = parseInt(chainIdDiv.innerHTML, 16) || networkId;
    const msgParams = msg;
    console.log('data passed compare here');
    console.log(JSON.stringify(msgParams));
    console.log(msgParams);
    console.log(accounts[0]);
    try {
      const account = walletAddress;
      console.log(ethereum);
      let sign = (await EIP712.signTypedData(ethereum, account, msgParams)).sig;

      /*const sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [from, stringify],
      });*/
      console.log(sign);
      console.log('Data passed to sig to be compared');
      dataTwo['signatures'] = [sign];
      console.log(JSON.stringify(dataTwo));
      let results = await putLazyMint(dataTwo);
      console.log('look below');
      console.log(results);
      signTypedDataV4Result.innerHTML = 'https://ropsten.rarible.com/token/0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05:' + results['tokenId'];
    } catch (err) {
      console.error(err);
      signTypedDataV4Result.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   *  Sign Typed Data V4 Verification
   */


  function handleNewAccounts(newAccounts) {
    accounts = newAccounts;
    accountsDiv.innerHTML = accounts;
    if (isMetaMaskConnected()) {
      initializeAccountButtons();
    }
    updateButtons();
  }

  function handleNewChain(chainId) {
    chainIdDiv.innerHTML = chainId;
  }



  function handleNewNetwork(networkId) {
    networkDiv.innerHTML = networkId;
  }

  async function getNetworkAndChainId() {
    try {
      const chainId = await ethereum.request({
        method: 'eth_chainId',
      });
      handleNewChain(chainId);

      const networkId = await ethereum.request({
        method: 'net_version',
      });
      handleNewNetwork(networkId);

      const block = await ethereum.request({
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
      });

    } catch (err) {
      console.error(err);
    }
  }

  updateButtons();

  if (isMetaMaskInstalled()) {
    ethereum.autoRefreshOnNetworkChange = false;
    getNetworkAndChainId();

    ethereum.autoRefreshOnNetworkChange = false;
    getNetworkAndChainId();

    ethereum.on('chainChanged', (chain) => {
      handleNewChain(chain);
      ethereum
        .request({
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
        })
        .then((block) => {
        });
    });
    ethereum.on('networkChanged', handleNewNetwork);
    ethereum.on('accountsChanged', (newAccounts) => {
      ethereum
        .request({
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
        })
        .then((block) => {
        });
      handleNewAccounts(newAccounts);
    });

    try {
      const newAccounts = await ethereum.request({
        method: 'eth_accounts',
      });
      handleNewAccounts(newAccounts);
    } catch (err) {
      console.error('Error on init when getting accounts', err);
    }
  }
};

window.addEventListener('DOMContentLoaded', initialize);

// utils

function getPermissionsDisplayString(permissionsArray) {
  if (permissionsArray.length === 0) {
    return 'No permissions found.';
  }
  const permissionNames = permissionsArray.map((perm) => perm.parentCapability);
  return permissionNames
    .reduce((acc, name) => `${acc}${name}, `, '')
    .replace(/, $/u, '');
}

function stringifiableToHex(value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}

