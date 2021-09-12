import requests
from pathlib import Path
import sys
import os
import subprocess

from dotenv import load_dotenv

load_dotenv()


def pin_nft_to_nftstore(path_to_file, content_type):
    print(path_to_file)
    url = 'https://api.nft.storage/upload'
    h = {'Authorization': 'Bearer ' + os.environ.get('NFT_STORE_API_KEY'),
         'Content-Type': 'video'}
    if type(path_to_file) is str:
        path_to_file = Path(path_to_file)
    if path_to_file.is_dir():
        files = [("file", (file.as_posix(), open(file, "rb")))
                 for file in path_to_file.glob('**/*') if not file.is_dir()]
    else:
        with open(path_to_file, "rb") as f:
            data = f.read()
        print(len(data))
        files = data
    res = requests.post(url, data=files, headers=h, timeout=59)
    if res.status_code == 200:
        print(res.json()['value']['cid'])
        return res.json()['value']['cid']
    if res.json()['ok'] == False:
        print(res.json())
        print('We have encountered a error:' + res.json()['error']['message'])
    return res
