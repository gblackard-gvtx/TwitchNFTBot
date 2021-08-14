# Twitch NFT Bot

## Created by Tommy Braccia and Geoffery Blackard
The Twitch NFT Bot is intended to clip the last 30 seconds of any streamer on Twitches stream and automatically mint it so that it can be sold either for charity or the streamer's own profit.

### RinkebyDeployment Directory
The Rinkeby Deployment Directory is based on the [NFT-Mix Repository](https://github.com/PatrickAlphaC/nft-mix) by PatrickAlphaC. It has been modified in many way such as including the logic necessary to clip the last 30 seconds on Twitch, deploy to NFT.Storage rather than Pinata, to deploy the tokens under a new contract, and more. It is ran on an AWS EC2 instance as a Flask application and the majority of the logic needed to deploy a contract is located under the pipeline.py file.

### TwitchBot Directory
The Twitch Bot Directory is where the Twitch Chat Bot's logic is located. The index file is ran using Node.Js.