import os
import time
import subprocess
import requests
from rarible.uploadRaribleMetadata import upload_raible_metadata
from scripts.advanced_collectible.get_clip_info import get_clip
from scripts.advanced_collectible.download_twitch_video import download_twitch_clip
from scripts.advanced_collectible.create_nft_from_twitch import pin_file_to_ipfs
from scripts.advanced_collectible.create_clip import create_clip
import cv2 as cv

def create_clip_and_thumbnail():
    clip_id = create_clip()
    print(f'Clip Id: {clip_id}')
    if clip_id.startswith('Error: '):
        return clip_id
    mint_and_upload_clip(clip_id)

def create_thumbnail_and_get_ipfs(path_to_video):
    image_file_name = 'thumbnail.jpeg'
    vidcap = cv.VideoCapture(path_to_video)

    vidcap.set(cv.CAP_PROP_POS_MSEC, 5000)

    success, image = vidcap.read()

    # save image to temp file
    cv.imwrite(image_file_name, image)

    vidcap.release()
    return pin_file_to_ipfs(image_file_name)

def mint_and_upload_clip(slug):
    time.sleep(10)
#    userName = 'testName'
#    title= 'testTitle'
    userName, title = get_clip(slug)
    print('Username is: ' + userName)
    print('Title is: ' + title)
    print(slug)
    download_twitch_clip(slug)
    # download the video locally using youtube dl and then pass that path below
    path_to_downloaded_video = 'clip.mp4'
    video_ipfs_hash = pin_file_to_ipfs(path_to_downloaded_video)
    print("Ipfs Hash of the Video is: "+video_ipfs_hash)
    thumbnail_ipfs_hash = create_thumbnail_and_get_ipfs(path_to_downloaded_video)
    # The following is used because youtube_dl doesn't overwrite files with the same name
    print("Ipfs Hash of the thumbnail is: "+thumbnail_ipfs_hash)

    os.remove('clip.mp4')
    os.remove('thumbnail.jpeg')
    ipfs_of_metadata = upload_raible_metadata(userName, title, video_ipfs_hash,thumbnail_ipfs_hash)
    print(ipfs_of_metadata)
    return ipfs_of_metadata


