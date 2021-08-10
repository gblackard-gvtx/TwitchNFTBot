#!/usr/bin/python3
import os
import requests
import json
from brownie import AdvancedCollectible, network
from metadata import sample_metadata
from pathlib import Path
from dotenv import load_dotenv
import datetime

load_dotenv()

imageURL = "https://ipfs.io/ipfs/QmTcqfKURfphReDCnTbSFUfByzfFjuRszwKFV6Xeb8Wxt6?filename=video.mp4"
streamer = 'Temporary'
stream_title = 'Temporary'


def main():
    with open("scripts/advanced_collectible/meta.txt") as fp:
        streamer = fp.readline()
        stream_title = fp.readline()
        imageURL = "https://ipfs.io/ipfs/"+fp.readline()+"?filename=video.mp4"
    print(f'Streamer was: {streamer}')
    print(f'Stream Title was: {stream_title}')
    print(f'Image URL Tis: {imageURL}')
    print("Working on " + network.show_active())
    advanced_collectible = AdvancedCollectible[len(AdvancedCollectible) - 1]
    number_of_advanced_collectibles = advanced_collectible.tokenCounter()
    print(
        "The number of tokens you've deployed is: "
        + str(number_of_advanced_collectibles)
    )
    write_metadata(number_of_advanced_collectibles, advanced_collectible)


def write_metadata(token_ids, nft_contract):
    for token_id in range(token_ids):
        collectible_metadata = sample_metadata.metadata_template
        metadata_file_name = (
            "./metadata/{}/".format(network.show_active())
            + str(token_id)
            + "-"
            + 'twitchClipTokens'  # insert streamer here
            + ".json"
        )
        if Path(metadata_file_name).exists():
            print(
                "{} already found, delete it to overwrite!".format(
                    metadata_file_name)
            )
        else:
            f = open("scripts/advanced_collectible/meta.txt", "r")
            variables = f.readlines()
            lines = []
            count = 0
            # Strips the newline character
            for line in variables:
                lines.append(line.strip())
                count += 1
            streamer = lines[0]
            stream_title = lines[1]
            imageURL = lines[2]
            print(imageURL)
            print(stream_title)
            print("Creating Metadata file: " + metadata_file_name)
            collectible_metadata["name"] = (f"{streamer}'s Clip created on " +
                                            datetime.datetime.today().strftime("%d/%m/%Y %H:%M %p %Z")).strip()
            collectible_metadata["description"] = (f"A clip created by {streamer} on " + datetime.datetime.today(
            ).strftime("%d/%m/%Y")+f" during the stream '{stream_title}'").strip()
            collectible_metadata["image"] = "https://ipfs.io/ipfs/" + \
                imageURL+"?filename=video.mp4"
            with open(metadata_file_name, "w") as file:
                json.dump(collectible_metadata, file)
            path = write_json_file(collectible_metadata)
            hash_created = pinMetadata(path)
            
            print(hash_created)
            return hash_created
# Stolen from https://github.com/Vourhey/pinatapy/blob/master/pinatapy/__init__.py


def write_json_file(json_to_pin):
    path = 'temp.json'
    with open(path, 'w') as outfile:
        json.dump(json_to_pin, outfile)
    return path


def pinMetadata(path_to_file, options=None):
    url = 'https://api.nft.storage/upload'
    h = {'Authorization': 'Bearer ' + os.environ.get('NFT_STORE_API_KEY'),
         'Content-Type': 'application/json'}

    if type(path_to_file) is str:
        path_to_file = Path(path_to_file)
    if path_to_file.is_dir():
        files = [("file", (file.as_posix(), open(file, "rb")))
                 for file in path_to_file.glob('**/*') if not file.is_dir()]
    else:
        with open(path_to_file, 'rb') as f:
            data = f.read()
        files = data
    res = requests.post(url, data=files, headers=h)

    if res.status_code == 200:
        print(res.json())
        return res.json()['value']['cid']
    if res.json()['ok'] == False:
        print('We have encountered a error:' + res.json()['error']['message'])
    return res
