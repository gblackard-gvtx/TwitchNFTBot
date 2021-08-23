from flask import Flask
from pipeline import create_clip_and_mint
from rariblePipeline import create_clip_and_thumbnail
from flask import request

app = Flask(__name__)


@app.route("/")
def create_openseas_nft():
    return create_clip_and_mint()


@app.route("/rarible")
def create_rarible_nft():
    print('Calling Rarible create')
    hashes = create_clip_and_thumbnail()
    return f'http://localhost:9011/?metaIpfs={hashes[0]}&videoIpfs={hashes[1]}'


if __name__ == "__main__":
    app.run()
