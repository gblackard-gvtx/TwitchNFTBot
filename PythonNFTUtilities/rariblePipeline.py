import os
import time
from rarible.uploadRaribleMetadata import upload_raible_metadata
from scripts.advanced_collectible.get_clip_info import get_clip
from scripts.advanced_collectible.download_twitch_video import download_twitch_clip
from scripts.advanced_collectible.create_nft_from_twitch import pin_file_to_ipfs
from scripts.advanced_collectible.create_clip import create_clip
import cv2 as cv


def create_thumbnail(path_to_video):
    image_file_name = 'thumbnail.jpeg'
    vidcap = cv.VideoCapture(path_to_video)
    vidcap.set(cv.CAP_PROP_POS_MSEC, 5000)
    success, image = vidcap.read()
    # save image to temp file
    cv.imwrite(image_file_name, image)
    vidcap.release()
    return image_file_name


def get_clip_info(slug):
    time.sleep(15)
    # Sample user_name and title used when testing without streaming.
    user_name = 'testName'
    title = 'testTitle'
    user_name, title = get_clip(slug)  # Comment out this line when testing
    print('user_name is: ' + user_name)
    print('Title is: ' + title)
    return user_name, title


def pin_files_and_get_url(user_name, title, path_to_clip, path_to_thumbnail):
    # download the video locally using youtube dl and then pass that path below
    video_ipfs_hash = pin_file_to_ipfs(path_to_clip)
    thumbnail_ipfs_hash = pin_file_to_ipfs(path_to_thumbnail)
    print("Ipfs Hash of the Video is: "+video_ipfs_hash)
    print("Ipfs Hash of the thumbnail is: "+thumbnail_ipfs_hash)
    # The following is used because youtube_dl doesn't overwrite files with the same name and they are no longer needed.
    os.remove('clip.mp4')  # Comment out this line when testing
    os.remove('thumbnail.jpeg')  # Comment out this line when testing
    # creates and pins the metadata to IPFS for Rarible to view
    ipfs_of_metadata = upload_raible_metadata(
        user_name, title, video_ipfs_hash, thumbnail_ipfs_hash)
    return f'http://localhost:9011/?metaIpfs={ipfs_of_metadata}&videoIpfs={video_ipfs_hash}'


# The main method for the Rarible Pipeline
def create_clip_and_pin():
    # Calls the API to clip the last 30 seconds of stream and then gets the slug of the stream
    clip_id = create_clip()
    print(f'Clip Id: {clip_id}')
    if clip_id.startswith('Error: '):
        print(clip_id)
        return clip_id
    user_name, title = get_clip_info(clip_id)
    if user_name == 'Something went wrong on Twitch\'s end. Sorry!':
        # This means data was empty due to clip failing.
        return user_name
    path_to_clip = download_twitch_clip(clip_id)
    path_to_thumbnail = create_thumbnail(path_to_clip)
    # The below method pin the video, gets a thumbnail from the video, pins the metadata, and returns the nessecary url
    return pin_files_and_get_url(user_name, title, path_to_clip, path_to_thumbnail)
