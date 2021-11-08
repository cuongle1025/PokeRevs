"""POKEREVS"""
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import find_dotenv, load_dotenv
import flask
import models
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import (
    login_user,
    logout_user,
    login_required,
    LoginManager,
    current_user,
)
from sqlalchemy import exc
import json
import sys


load_dotenv(find_dotenv())


app = flask.Flask(__name__, static_folder="./build/static")
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

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    """User Loader"""
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return models.User.query.get(user_id)


bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/index")
# @login_required
def index():
    # TODO: insert the data fetched by your app main page here as a JSON
    DATA = {"your": "data here"}
    data = json.dumps(DATA)
    return flask.render_template("index.html", data=data,)


app.register_blueprint(bp)


@app.route("/")
def main():
    return ""


@app.route("/login/")
def login():
    return "a"


@app.route("/register/")
def register():
    return ""


@app.errorhandler(404)
def not_found(e):
    return flask.render_template("index.html")


if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 8080)), debug=True
    )
