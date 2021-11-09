"""Models"""
from flask_login import UserMixin
from init import db


class User(UserMixin, db.Model):
    """User"""

    id = db.Column(
        db.Integer, primary_key=True
    )  # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(1000), nullable=False)
    img = db.Column(db.String(200))
    bio = db.Column(db.String(256))

    reviews = db.relationship("Review", backref="user", lazy=True)

    def __repr__(self):
        return '<username %r>' % self.username


class Pokemon(db.Model):
    """Pokemon"""

    # The primary key, NOT the pokemon's pokedex id
    id = db.Column(db.Integer, primary_key=True)
    pokedex_id = db.Column(db.Integer, unique=True, nullable=False)

    reviews = db.relationship("Review", backref="pokemon", lazy=True)


class Review(db.Model):
    """Review"""

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.String(2000), nullable=False)

    pokedex_id = db.relationship(
        db.Integer, db.ForeignKey("pokemon.pokedex_id"))
    user_id = db.relationship(db.Integer, db.ForeignKey("user.id"))

    def __repr__(self):
        return '<review %r for pokemon %d>' % (self.title, self.pokedex_id)


db.create_all()
