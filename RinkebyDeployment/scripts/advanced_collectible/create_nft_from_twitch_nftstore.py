import requests
from pathlib import Path
import sys
import os
from dotenv import load_dotenv

load_dotenv()
 

def pin_nft_to_nftstore(path_to_file):
    print(path_to_file)
    url ='https://api.nft.storage/upload'
    h = {'Authorization': 'Bearer ' + os.environ.get('NFT_STORE_API_KEY'), 
        'Content-Type':'video'}
    if type(path_to_file) is str:
        path_to_file = Path(path_to_file)
    if path_to_file.is_dir():
        files = [("file", (file.as_posix(), open(file, "rb")))
                 for file in path_to_file.glob('**/*') if not file.is_dir()]
    else:
        files = {
            "file": open(path_to_file, "rb")
        }
    res = requests.post(url, files=files, headers=h)

    if res.status_code == 200:
        print(res.json())
        return res.json()['value']['cid']
    if res.json()['ok'] == False:
        print('We have encountered a errer:' + res.json()['error'])
    return res
