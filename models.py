# pylint: disable=invalid-name
# pylint: disable=missing-function-docstring
# pylint: disable=no-member
# pylint: disable=consider-using-f-string
# pylint: disable=too-few-public-methods
"""Models"""
from datetime import datetime
from flask_login import UserMixin
from init import db


class User(UserMixin, db.Model):
    """User"""

    __tablename__ = "user"

    user_id = db.Column(
        db.Integer, primary_key=True
    )  # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000), nullable=False)
    img = db.Column(db.String(200))
    bio = db.Column(db.String(256))

    reviews = db.relationship("Review", backref="user", lazy=True)

    def __repr__(self):
        return "<User %r>" % self.name

    def get_id(self):
        # Necessary function to override id default primary key name
        return (self.user_id)


class Pokemon(db.Model):
    """Pokemon"""

    __tablename__ = "pokemon"

    # The primary key, NOT the pokemon's pokedex id
    id = db.Column(db.Integer, primary_key=True)
    pokedex_id = db.Column(db.Integer, unique=True, nullable=False)

    reviews = db.relationship("Review", backref="pokemon", lazy=True)

    def __repr__(self):
        return "<pokemon %r>" % self.pokedex_id


class Review(db.Model):
    """Review"""

    __tablename__ = "review"

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.String(2000), nullable=False)
    time = db.Column(
        db.TIMESTAMP(timezone=False), nullable=False, default=datetime.now()
    )

    pokedex_id = db.Column(db.Integer, db.ForeignKey("pokemon.pokedex_id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))

    def __repr__(self):
        return "<review %r>" % self.title


db.create_all()
