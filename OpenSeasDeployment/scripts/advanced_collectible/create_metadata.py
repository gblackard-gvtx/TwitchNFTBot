#!/usr/bin/python3
import os
import requests
import json
from brownie import AdvancedCollectible, network
from metadata import sample_metadata
from scripts.helpful_scripts import get_breed
from pathlib import Path
from dotenv import load_dotenv
import datetime
import json

load_dotenv()

imageURL = "https://ipfs.io/ipfs/QmTcqfKURfphReDCnTbSFUfByzfFjuRszwKFV6Xeb8Wxt6?filename=video.mp4"
streamer='Tommy'
game='LoL'
def main():
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
            + 'twitchClipTokens' #insert streamer here
            + ".json"
        )
        if Path(metadata_file_name).exists():
            print(
                "{} already found, delete it to overwrite!".format(
                    metadata_file_name)
            )
        else:
            f = open("scripts/advanced_collectible/meta.txt", "r")
            variables=f.readlines()
            lines = []
            count = 0
            # Strips the newline character
            for line in variables:
                lines.append(line.strip())
                count += 1
            streamer=lines[0]
            game = lines[1]
            imageURL = lines[2]
            print(imageURL)
            print(game)
            print("Creating Metadata file: " + metadata_file_name)
            collectible_metadata["name"] = f"Geoffery Demo {streamer}'s Clip created on "+datetime.datetime.today().strftime("%d/%m/%Y %H:%M %p %Z")
            collectible_metadata["description"] = f"A clip created by {streamer} on"+ datetime.datetime.today().strftime("%d/%m/%Y")+" while playing {game}"
            collectible_metadata["image"] = "https://ipfs.io/ipfs/"+imageURL+"?filename=video.mp4"
            with open(metadata_file_name, "w") as file:
                json.dump(collectible_metadata, file)
            logs = pinMetadata(collectible_metadata)
            print(logs['IpfsHash'])

# Stolen from https://github.com/Vourhey/pinatapy/blob/master/pinatapy/__init__.py
def pinMetadata( json_to_pin, options=None):
    url_suffix = "pinning/pinJSONToIPFS"
    h = {'pinata_api_key': os.environ.get('PINATA_API_KEY'),
        'pinata_secret_api_key': os.environ.get('PINATA_API_SECRET')}
    h["Content-Type"] = "application/json"

    body = {
            "pinataContent": json_to_pin
            }

    if options is not None:
        if "pinataMetadata" in options:
            body["pinataMetadata"] = options["pinataMetadata"]
        if "pinataOptions" in options:
            body["pinataOptions"] = options["pinataOptions"]

    res = requests.post("https://api.pinata.cloud/" + url_suffix, json=body, headers=h)

    if res.status_code == 200:
        return res.json()

    return res
