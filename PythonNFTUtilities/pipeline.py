import os
import time
import subprocess
import requests
from scripts.advanced_collectible.get_clip_info import get_clip
from scripts.advanced_collectible.download_twitch_video import download_twitch_clip
from scripts.advanced_collectible.create_nft_from_twitch import pin_file_to_ipfs
from scripts.advanced_collectible.create_clip import create_clip


def write_file_for_metadata(streamer, clip_title, ipfs_hash):
    f = open("scripts/advanced_collectible/meta.txt", "w")
    f.writelines([streamer, '\n', clip_title, '\n', ipfs_hash])
    f.close()

def get_clip_information_and_download(slug):
    time.sleep(10)
    userName, title = get_clip(slug)
    print('Username is: ' + userName)
    print('Title is: ' + title)
    print(slug)
    download_twitch_clip(slug)
    return userName,title

def create_clip_and_mint():
    clip_id = create_clip()
    user_name='user'
    title='title'
    if clip_id.startswith('Error: '):
        return clip_id
    user_name,title = get_clip_information_and_download(clip_id)
    mint_and_upload_clip(user_name,title)


def mint_and_upload_clip(user_name,title):
    userName=user_name
    # download the video locally using youtube dl and then pass that path below
    path_to_downloaded_video = 'clip.mp4'
    video_ipfs_hash = pin_file_to_ipfs(path_to_downloaded_video)
    print(video_ipfs_hash)
    print("Ipfs Hash of the Video is: "+video_ipfs_hash)
    # The following is used because youtube_dl doesn't overwrite files with the same name
    os.remove('clip.mp4')
    write_file_for_metadata(userName, title, video_ipfs_hash)
    time.sleep(3)
    os.system(
        'brownie run scripts/advanced_collectible/create_collectible.py --network rinkeby')
    time.sleep(3)
    output = subprocess.check_output(
        "brownie run scripts/advanced_collectible/create_metadata.py --network rinkeby", shell=True, universal_newlines=True)
    jsonIPFSHash = output.split()[-1]
    if jsonIPFSHash == '0':
        # This seems to happen when the folder within metadata titled rinkeby was not created.
        # TODO: Add other failure cases.
        return 'NFT Creation failed'
    print("Ipfs Hash of the JSON is:" + jsonIPFSHash)
    if(jsonIPFSHash == "overwrite!"):
        runs = 0
        while(jsonIPFSHash == "overwrite!" and runs < 5):
            print('failed '+str(runs))
            runs = runs + 1
            time.sleep(10)
            output = subprocess.check_output(
                "brownie run scripts/advanced_collectible/create_metadata.py --network rinkeby", shell=True, universal_newlines=True)
            jsonIPFSHash = output.split()[-1]
        if jsonIPFSHash == "overwrite!":
            print("Notify Somebody Urgently")
            return 'Error: Creating the metadata for the NFT failed.'
    print(output)
    f = open("scripts/advanced_collectible/hash.txt", "w")
    f.write(jsonIPFSHash)
    f.close()
    time.sleep(3)
    outputOfUploading = subprocess.check_output(
        "brownie run scripts/advanced_collectible/set_tokenuri.py --network rinkeby", shell=True, universal_newlines=True)
    last_out_of_uploading = outputOfUploading.split()[-1]
    print(last_out_of_uploading)
    if(last_out_of_uploading == "tokenURI!!"):
        runs = 0
        while(last_out_of_uploading == "tokenURI!" and runs < 5):
            print('failed '+str(runs))
            runs = runs + 1
            time.sleep(10)
            outputOfUploading = subprocess.check_output(
                "brownie run scripts/advanced_collectible/set_tokenuri.py --network rinkeby", shell=True, universal_newlines=True)
            last_out_of_uploading = outputOfUploading.split()[-1]
        if last_out_of_uploading == "tokenURI!":
            print("Notify Somebody Urgently")
            return 'Error: Uploading the Clip to OpenSeas failed.'
    print(outputOfUploading)
    testnet_url = outputOfUploading.split()[-13]
    print(testnet_url)
    return testnet_url
