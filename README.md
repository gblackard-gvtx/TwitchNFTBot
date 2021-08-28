# Clint Bot - Twitch

## TwitchBot Directory
The TwitchBot Directory is the aspect that interacts with the Twitch Stream. It has the logic for a Chat Bot that listens for clipping commands and passes those commands to the PythonNFTUtilities directory where the Flask Application is located.

## PythonNFTUtilities Directory
The PythonNFTUtilities Directory is the backend that creates the Twitch Clip and pins all of the necessecary files for creating a RARI NFT to NFT.Storage. Once it successfully completes running it will return a URL that points to the Rarible Front End(RaribleFrontEnd Directory) for Lazy Minting a RARI Token including the needed query parameters.

## RaribleFrontEnd Directory
The RaribleFrontEnd Directory contains the code needed for displaying a front end that allows users to authenticate with MetaMask(needed for signing before lazy minting) and then Lazy Mint their clip. It also displays the clip that is about to be lazy minted on the web page after loading it from the IPFS(NFT.Storage). Finally, after Lazy Minting the streamer will be able to share the link with their stream or wait until a later time if they so choose.