import os
import time
import subprocess


def write_file_for_metadata(streamer, clip_title, ipfs_hash):
    f = open("scripts/advanced_collectible/meta.txt", "w")
    f.writelines([streamer, '\n', clip_title, '\n', ipfs_hash])
    f.close()


def create_new_node(slug):
    clipInformationLog = subprocess.check_output(
        'python3 scripts/advanced_collectible/getClipInfo.py '+slug, shell=True, universal_newlines=True)
    userName = clipInformationLog.split()[0]
    title = ' '.join(clipInformationLog.split()[1:])
    print('Username is: '+userName)
    print('Title is: '+title)
    print(slug)
    # download the video locally using youtube dl and then pass that path below
    path_to_downloaded_video = 'scripts/advanced_collectible/42934450493-offset-1190.mp4'
    videoHash = subprocess.check_output('python3 scripts/advanced_collectible/create_nft_from_twitch.py ' +
                                        path_to_downloaded_video, shell=True, universal_newlines=True)
    videoHash = videoHash.split()[-1]
    print("Ipfs Hash of the Video is: "+videoHash)
    write_file_for_metadata(userName, title, videoHash)
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
