from flask import Flask
from rariblePipeline import create_clip_and_pin

app = Flask(__name__)


@app.route("/")
def create_rarible_nft():
    print('Calling Rarible create')
    return create_clip_and_pin()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
