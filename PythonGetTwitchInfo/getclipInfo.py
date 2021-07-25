mport os
import requests
import os
import json
from dotenv import load_dotenv

load_dotenv('D:\\Users\\Adam\\TwitchNFTBot\\TwitchNFTBot\\PythonGetTwitchInfo\\.env')

clipID = 'AnimatedAdventurousHumanKappaPride-8Il1C4EdtT92Bq3n'
clipURL = 'https://api.twitch.tv/helix/clips'
authURL = 'https://id.twitch.tv/oauth2/token'
CLIENT = os.getenv('CLIENT')
refresh = os.getenv('REFRESH')
secret= os.getenv('SECRET')
rATQuery = {'grant_type':'refresh_token', 'refresh_token': refresh, 'client_id':CLIENT, 'client_secret': secret}
gCQuery = {'id':clipID}
# uses refresh token to get new access token
def getRefreshAccessToken():
    response = requests.post(authURL,params=rATQuery)
    json = response.json()
    access_token = json['access_token']
    return access_token


# pass in access token to get the username and the title of the clip 
def getClip(accessToken):
    headers = {'Authorization': 'Bearer ' + accessToken, 'Client-ID':CLIENT }
    response = requests.get(clipURL,params=gCQuery,headers=headers)
    if response.status_code == 200:
        json = response.json()
        userName = json['data'][0]['creator_name']
        title = json['data'][0]['title']
    return userName,title

access_token = getRefreshAccessToken()
getClip(access_token)
