# React Front End for Lazy Minting To Rarible
The foundations for this code were based on the MetaMask Test Dapp
## Setup
- Install [Node.js](https://nodejs.org) version 12
  - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn v1](https://yarnpkg.com/en/docs/install)
- Run `yarn setup` to install dependencies and run any requried post-install scripts
  - **Warning:** Do not use the `yarn` / `yarn install` command directly. Use `yarn setup` instead. The normal install command will skip required post-install scripts, leaving your development environment in an invalid state.
  
## Running
Run `npm run start` to run the front end

## Description
When the web front end is properly passed two relevant IPFS Hashes it will display the Clip that was created and pinned by the Flask back end and have the option for the user to Lazy Mint the file to Rarible after they authenticate with Metamask.

## Testing
After running the application you can use the following link for a working testing example: http://localhost:9011/?metaIpfs=QmbXRv7PcUnNs12BhDTK18vRSwe2m4JyDtCmki2Aku9gPJ&videoIpfs=QmeynYjeMnWVXs4APAfr1GNRqUteAz3ABxYfBYGdstNvVB

