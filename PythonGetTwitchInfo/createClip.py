import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

clipURL = 'https://api.twitch.tv/helix/clips'
CLIENT = os.getenv('CLIENT')
BROADCASTID= os.getenv('BROADCASTID')
cCQuery = {'broadcaster_id':BROADCASTID}


# pass in access token to get the username and the title of the clip 
def createClip(accessToken):
    headers = {'Authorization': 'Bearer ' + accessToken, 'Client-ID':CLIENT }
    response = requests.post(clipURL,params=cCQuery,headers=headers)
    if response.status_code == 200:
        json = response.json()
        id = json.data[0].id
    return id
createClip()