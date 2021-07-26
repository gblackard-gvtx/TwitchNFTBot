import os
import time
import subprocess
from scripts.advanced_collectible.getClipInfo import get_clip
from scripts.advanced_collectible.download_twitch_video import download_twitch_clip
from scripts.advanced_collectible.create_nft_from_twitch import pin_file_to_ipfs

def write_file_for_metadata(streamer, clip_title, ipfs_hash):
    f = open("scripts/advanced_collectible/meta.txt", "w")
    f.writelines([streamer, '\n', clip_title, '\n', ipfs_hash])
    f.close()


def create_new_node(slug):
    userName, title = get_clip(slug)
    print('Username is: ' + userName)
    print('Title is: ' + title)
    print(slug)
    download_twitch_clip(slug)
    # download the video locally using youtube dl and then pass that path below
    path_to_downloaded_video = 'clip.mp4'

    video_ipfs_hash= pin_file_to_ipfs(path_to_downloaded_video)
    print("Ipfs Hash of the Video is: "+video_ipfs_hash)
    write_file_for_metadata(userName, title, video_ipfs_hash)
    time.sleep(3)
    os.system(
        'brownie run scripts/advanced_collectible/create_collectible.py --network rinkeby')
    time.sleep(3)
    output = subprocess.check_output(
        "brownie run scripts/advanced_collectible/create_metadata.py --network rinkeby", shell=True, universal_newlines=True)
    jsonIPFSHash = output.split()[-1]
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
    print(outputOfUploading)
    testnet_url = outputOfUploading.split()[-13]
    print(testnet_url)
    return testnet_url


create_new_node('AnimatedAdventurousHumanKappaPride-8Il1C4EdtT92Bq3n')
