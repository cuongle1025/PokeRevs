"""POKEREVS"""
from init import app, db, bp
import os
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
    # TODO: insert the data fetched by your app main page here as a JSON

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

    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    new_user = models.User(
        email=email,
        username=username,
        name=name,
        password=generate_password_hash(password, method="sha256"),
        img=img,
        bio=bio,
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
    else:
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
    print(type(data), file=sys.stderr)
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
    username = flask.request.json.get('username')
    img = flask.request.json.get('img')
    bio = flask.request.json.get('bio')
    data = DB.updateProfile(username=username, img=img, bio=bio)
    return flask.jsonify({"success": data})


@app.route("/getProfile", methods=["POST"])
def getProfile():
    username = flask.request.json.get('username')
    data = DB.getUser(username=username)
    data_json = DB.jsonifyUser(data)
    return flask.jsonify(data_json)


if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 8080)), debug=True
    )
