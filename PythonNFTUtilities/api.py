from flask import Flask
from pipeline import create_clip_and_mint
from flask import request

app = Flask(__name__)


@app.route("/")
def create_clip():
    return create_clip_and_mint()
