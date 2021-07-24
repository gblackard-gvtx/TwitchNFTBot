import requests
from dotenv import dotenv_values

config = dotenv_values(".env")
clipID = 'AnimatedAdventurousHumanKappaPride-8Il1C4EdtT92Bq3n'
url = 'https://api.twitch.tv/kraken/clips/{0}'.format(clipID)
CLIENT = config.get('CLIENT')
headers = {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID':CLIENT }

response = requests.get(url,headers=headers)


