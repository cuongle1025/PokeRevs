# pylint: disable=invalid-name
# pylint: disable=missing-function-docstring
"""POKEREVS"""
import json
import os
import requests
import flask
from flask import session
from flask_login import (
    login_user,
    logout_user,
    login_required,
    LoginManager,
    current_user,
)
from werkzeug.security import check_password_hash
from pip._vendor import cachecontrol
import google.auth.transport.requests
from google.oauth2 import id_token
from init import app, bp, flow, google_client_id
import models
from dbhandler import DB

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    """User Loader"""
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return models.User.query.get(user_id)


@bp.route("/index")
@login_required
def index():
    username = current_user.username
    name = current_user.name
    img = current_user.img
    bio = current_user.bio

    DATA = {"username": username, "name": name, "img": img, "bio": bio}
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
    img = ""
    bio = ""

    user = models.User.query.filter_by(email=email).first()

    if not email or not username or not name or not password:  # for null input
        flask.flash("Information can't be null!")
        return flask.redirect(flask.url_for("signup"))
    if (
        user
    ):  # if a user is found, we want to redirect back to signup page so user can try again
        flask.flash("Email address already exists")
        return flask.redirect(flask.url_for("signup"))

    DB.addUser(email, username, name, password, img, bio)

    return flask.redirect(flask.url_for("login"))


@app.route("/googlesignin")
def googlesignin():
    auth_url, state = flow.authorization_url()
    session["state"] = state
    return flask.redirect(auth_url)


@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=flask.request.url)
    if not session['state'] == flask.request.args['state']:
        return flask.redirect(flask.url_for('login'))

    credentials = flow.credentials
    request = requests.session()
    cache = cachecontrol.CacheControl(request)
    token = google.auth.transport.requests.Request(session=cache)

    try:
        #pylint: disable=protected-access
        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token,
            request=token,
            audience=google_client_id
        )
        email = id_info.get('email')
        if DB.isUserByEmail(email=email):
            user = models.User.query.filter_by(email=email).first()
            login_user(user)
            return flask.redirect(flask.url_for("bp.index"))
        session['email'] = email
        session['name'] = id_info.get('name')
        session['img'] = id_info.get('picture')
        session['bio'] = ''
        session['isGoogleAuthenticated'] = True
        return flask.redirect(flask.url_for('nextstep'))

    except ValueError:
        return flask.redirect(flask.url_for('login'))


@app.route("/nextstep")
def nextstep():
    if session['isGoogleAuthenticated']:
        return flask.render_template('nextstep.html')
    flask.flash("Error--attempted to bypass google sign-in")
    return flask.redirect(flask.url_for('login'))


@app.route("/nextstep", methods=["Post"])
def nextstep_post():
    if session['isGoogleAuthenticated']:
        email = session['email']
        username = flask.request.form.get("username")
        name = session['name']
        password = flask.request.form.get("password")
        img = session['img']
        bio = ""

        if not username or not password:  # for null input
            flask.flash("Information can't be null!")
            return flask.redirect(flask.url_for("nextstep"))

        if DB.isUser(username=username):
            flask.flash("username already exists.")
            return flask.redirect(flask.url_for("nextstep"))

        DB.addUser(email, username, name, password, img, bio)
        login_user(DB.getUser(username=username))
        return flask.redirect(flask.url_for("bp.index"))
    flask.flash("Error--attempted to bypass google sign-in")
    return flask.redirect(flask.url_for('login'))


@app.route("/logout")
@login_required
def logout():
    """Logout"""
    logout_user()
    session.clear()
    return flask.redirect(flask.url_for("home"))


@app.route("/")
def home():
    """Home"""
    return flask.render_template("main.html")


@app.errorhandler(404)
def not_found(e):
    if current_user.is_authenticated:
        username = current_user.username
        name = current_user.name
        img = current_user.img
        bio = current_user.bio

        DATA = {"username": username, "name": name, "img": img, "bio": bio}
        data = json.dumps(DATA)
        return flask.render_template("index.html", data=data,)
    print(e)
    return flask.render_template("index.html")


@app.route("/getReviews", methods=["POST"])
def getReviews():
    username = flask.request.json.get("username")
    data = DB.getUserReviews(username=username)
    data_json = DB.jsonifyReviews(data)
    return flask.jsonify(data_json)


@app.route("/getUserReview", methods=["POST"])
def getUserReview():
    username = flask.request.json.get("username")
    pokemonid = flask.request.json.get("pokemonid")
    data = DB.getUserReview(username=username, pokedex_id=pokemonid)
    data_json = DB.jsonifyReviews(data)
    return flask.jsonify(data_json)


@app.route("/getPokemonReviews", methods=["POST"])
def getPokemonReviews():
    pokemonid = flask.request.json.get("pokemonid")
    data = DB.getPokemonReviews(pokedex_id=pokemonid)
    data_json = DB.jsonifyReviews(data)
    return flask.jsonify(data_json)


@app.route("/addReview", methods=["POST"])
def addReview():
    username = flask.request.json.get("username")
    pokemonid = flask.request.json.get("pokemonid")
    rating = flask.request.json.get("rating")
    title = flask.request.json.get("title")
    body = flask.request.json.get("body")
    DB.addReview(
        username=username, pokedex_id=pokemonid, rating=rating, title=title, body=body
    )
    data = DB.getUserReview(username, pokemonid)
    data_json = DB.jsonifyReviews(data)
    return flask.jsonify(data_json)


@app.route("/updateProfile", methods=["POST"])
def updateProfile():
    username = flask.request.json.get("username")
    img = flask.request.json.get("img")
    bio = flask.request.json.get("bio")
    data = DB.updateProfile(username=username, img=img, bio=bio)
    return flask.jsonify({"success": data})


@app.route("/getProfile", methods=["POST"])
def getProfile():
    username = flask.request.json.get("username")
    data = DB.getUser(username=username)
    data_json = DB.jsonifyUser(data)
    return flask.jsonify(data_json)


if __name__ == "__main__":
    app.run(
        # pylint: disable=invalid-envvar-default
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
