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

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    """User Loader"""
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return models.User.query.get(user_id)


bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/index")
@login_required
def index():
    # TODO: insert the data fetched by your app main page here as a JSON
    DATA = {"your": "data here"}
    data = json.dumps(DATA)
    return flask.render_template("index.html", data=data,)


app.register_blueprint(bp)


@app.route("/login")
def login():
    """Login"""
    return flask.render_template("login.html")


@app.route("/login", methods=["POST"])
def login_post():
    """Login"""
    email = flask.request.form.get("email")
    password = flask.request.form.get("password")

    user = models.User.query.filter_by(email=email).first()

    # check if the user actually exists
    if not user or not check_password_hash(user.password, password):
        flask.flash("Please check your login details and try again.")
        return flask.redirect(
            flask.url_for("login")
        )  # if the user doesn't exist or password is wrong, reload the page

    # if the above check passes, then we know the user has the right credentials
    login_user(user)
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/signup")
def signup():
    """Signup"""
    return flask.render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    """Signup"""
    email = flask.request.form.get("email")
    username = flask.request.form.get("username")
    name = flask.request.form.get("name")
    password = flask.request.form.get("password")

    user = models.User.query.filter_by(email=email).first()

    if not email or not username or not name or not password:  # for null input
        flask.flash("Information can't be null!")
        return flask.redirect(flask.url_for("signup"))
    if (
        user
    ):  # if a user is found, we want to redirect back to signup page so user can try again
        flask.flash("Email address already exists")
        return flask.redirect(flask.url_for("signup"))

    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    new_user = models.User(
        email=email,
        username=username,
        name=name,
        password=generate_password_hash(password, method="sha256"),
    )

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return flask.redirect(flask.url_for("login"))


@app.route("/logout")
@login_required
def logout():
    """Logout"""
    logout_user()
    return flask.render_template("main.html")


@app.route("/")
def home():
    """Home"""
    return flask.render_template("main.html")


if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 8080)), debug=True
    )
