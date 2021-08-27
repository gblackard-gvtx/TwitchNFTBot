# Flask Backend for Twitch Clipping and Pinning
## Setup
- Run `pip install -r requirements.txt`
## Running
- Run the flask backend in the background using `nohup python3 apy.py &`
- Kill the Flask backend when updating by using `kill $(lsof -t -i:8080)`
## Description
The Flask Backend is called by the Twitch Chat Bot and will clip the last 30 seconds of the streamers stream, get information about the stream at that given time(title and the streamer), download the clip created, create a thumbnail from the clip, pin the clip and the thumbnail to NFT.Storage, create metadata based on the previous informaiton and the IPFS hashes, pin the metadata to the NFT.Storage, and finally return a URL to the React App where the clip can be lazy minted by the streamer(or anybody else for that matter, however, the value associated with the NFT would come from it being minted by the streamer).