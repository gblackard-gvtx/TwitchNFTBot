from flask import Flask
from pipeline import create_new_node
from flask import request

app = Flask(__name__)

@app.route("/")
def hello_world():
    slug = request.args.get('slug')
    if slug is None:
        return "I need the video's slug"
    print(slug)
    return create_new_node(slug)