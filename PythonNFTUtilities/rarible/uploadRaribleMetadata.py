from dotenv import load_dotenv
import datetime
import json
from scripts.advanced_collectible.create_nft_from_twitch_nftstore import pin_file_to_nftstorage

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
    with open('meta.json', 'w') as outfile:
        json.dump(collectible_metadata, outfile)
    hash = pin_file_to_nftstorage('meta.json', 'application/json')
    return (hash)
