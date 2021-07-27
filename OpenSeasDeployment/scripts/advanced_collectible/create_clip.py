import requests
import os
from dotenv import load_dotenv


load_dotenv()
CLIENT = os.environ.get('CLIENT')
authURL = 'https://id.twitch.tv/oauth2/token'
refresh = os.environ.get('REFRESH')
secret = os.environ.get('SECRET')
rATQuery = {'grant_type': 'refresh_token', 'refresh_token': refresh,
            'client_id': CLIENT, 'client_secret': secret}
clipURL = 'https://api.twitch.tv/helix/clips'
CLIENT = os.getenv('CLIENT')
BROADCASTID = os.getenv('BROADCASTID')
cCQuery = {'broadcaster_id': BROADCASTID}


def get_refresh_access_token():
    response = requests.post(authURL, params=rATQuery)
    json = response.json()
    access_token = json['access_token']
    print(f'Access Token: {access_token}')
    return access_token

# pass in access token to get the username and the title of the clip


def create_clip():
    accessToken = get_refresh_access_token()
    headers = {'Authorization': 'Bearer ' + accessToken, 'Client-ID': CLIENT}
    response = requests.post(clipURL, params=cCQuery, headers=headers)
    if response.status_code <= 202:
        json = response.json()
        id = json['data'][0]['id']
    else:
        print(f'Error: {response.json()}')
        return f'Error: {response.json().message}'

    print(f'Clip ID: {id}')
    return id
