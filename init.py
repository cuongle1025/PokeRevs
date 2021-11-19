# pylint: disable=invalid-name
# pylint: disable=missing-function-docstring
"""POKEREVS"""
import os
import json
from flask_sqlalchemy import SQLAlchemy
from google_auth_oauthlib.flow import Flow
from dotenv import find_dotenv, load_dotenv
import flask


load_dotenv(find_dotenv())


app = flask.Flask(__name__, static_folder="./build/static")
# app = Flask(__name__)
# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
#  Point SQLAlchemy to your Heroku database

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
#   Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_POOL_SIZE"] = 1000


# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy(app)
db.init_app(app)

bp = flask.Blueprint("bp", __name__, template_folder="./build")

google_client_id = os.getenv('GOOGLE_CLIENT_ID')
google_client_secret_json = json.loads(os.getenv('GOOGLE_CLIENT_SECRET_JSON'))
flow = Flow.from_client_config(client_config=google_client_secret_json,
                               scopes=["https://www.googleapis.com/auth/userinfo.profile",
                                       "https://www.googleapis.com/auth/userinfo.email", "openid"],
                               redirect_uri=os.getenv("REDIRECT_URI"))
