import os
import requests
from dotenv import load_dotenv
import datetime

load_dotenv()


def upload_raible_metadata(streamer, stream_title, videoURL, imageURL):
    print(imageURL)
    print(stream_title)
    collectible_metadata = {}
    collectible_metadata["name"] = (f"{streamer}'s Clip created on " +
                                    datetime.datetime.today().strftime("%d/%m/%Y %H:%M %p %Z")).strip()
    collectible_metadata["description"] = (f"A clip created by {streamer} on " + datetime.datetime.today(
    ).strftime("%d/%m/%Y")+f" during the stream '{stream_title}'").strip()
    collectible_metadata["animation_url"] = "https://ipfs.io/ipfs/" + \
        videoURL+"?filename=video.mp4"
    collectible_metadata["image"] = "https://ipfs.io/ipfs/" + \
        imageURL+"?filename=image.jpeg"
    collectible_metadata["attributes"] = []
    logs = pinMetadata(collectible_metadata)
    return (logs['IpfsHash'])


def pinMetadata(json_to_pin, options=None):
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

    res = requests.post("https://api.pinata.cloud/" +
                        url_suffix, json=body, headers=h)

    if res.status_code == 200:
        return res.json()

    return res
