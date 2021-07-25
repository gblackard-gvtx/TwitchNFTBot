import requests
from pathlib import Path
import sys
import os
from dotenv import load_dotenv
load_dotenv()


def pin_file_to_ipfs(path_to_file, options=None):
    print(path_to_file)

    h = {'pinata_api_key': os.environ.get('PINATA_API_KEY'),
            'pinata_secret_api_key': os.environ.get('PINATA_API_SECRET')}
    url_suffix = "pinning/pinFileToIPFS"
    if type(path_to_file) is str: path_to_file = Path(path_to_file)
    if path_to_file.is_dir():
        files = [("file",(file.as_posix(), open(file, "rb"))) for file in path_to_file.glob('**/*') if not file.is_dir()]
    else:
        files = {
                "file": open(path_to_file, "rb")
                }

    if options is not None:
        if "pinataMetadata" in options:
            files["pinataMetadata"] = options["pinataMetadata"]
        if "pinataOptions" in options:
            files["pinataOptions"] = options["pinataOptions"]

    res = requests.post("https://api.pinata.cloud/" + url_suffix, files=files, headers=h)

    if  res.status_code == 200:
        print(res.json()['IpfsHash'])
        return res.json()

    return res
    
pin_file_to_ipfs(str(sys.argv[1]))