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

    # pokemons = db.relationship("Pokemon")


# class Pokemon(db.Model):
#     """Pokemon"""

#     user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

db.create_all()
