import requests
import os
from dotenv import load_dotenv
import sys

load_dotenv()

clipID = 'AnimatedAdventurousHumanKappaPride-8Il1C4EdtT92Bq3n'
clipURL = 'https://api.twitch.tv/helix/clips'
authURL = 'https://id.twitch.tv/oauth2/token'
CLIENT = os.environ.get('CLIENT')
refresh = os.environ.get('REFRESH')
secret = os.environ.get('SECRET')
rATQuery = {'grant_type': 'refresh_token', 'refresh_token': refresh,
            'client_id': CLIENT, 'client_secret': secret}
# uses refresh token to get new access token


def getRefreshAccessToken():
    response = requests.post(authURL, params=rATQuery)
    json = response.json()
    access_token = json['access_token']
    return access_token


# pass in access token to get the username and the title of the clip
def get_clip(clip_id):
    print(clip_id)
    gCQuery = {'id': clip_id}
    accessToken = getRefreshAccessToken()
    headers = {'Authorization': 'Bearer ' + accessToken, 'Client-ID': CLIENT}
    response = requests.get(clipURL, params=gCQuery, headers=headers)
    if response.status_code == 200:
        json = response.json()
        print(json)
        userName = json['data'][0]['creator_name']
        title = json['data'][0]['title']
    return userName, title
