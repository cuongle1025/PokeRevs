import models
from init import db
from random import randint
from werkzeug.security import generate_password_hash


class DB:
    def addUser(email, username, name, password, img, bio):
        # create a new user with the form data. Hash the password so the plaintext version isn't saved.
        new_user = models.User(
            email=email,
            password=generate_password_hash(password, method="sha256"),
            username=username,
            name=name,
            img=img,
            bio=bio,
        )

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()

    def getUser(username):
        return models.User.query.filter_by(username=username).first()

    def isUser(username):
        return len(models.User.query.filter_by(username=username).all()) != 0

    def updateProfile(username, img, bio):
        user = models.User.query.filter_by(username=username).first()
        if not user:
            return False
        user.img = img
        user.bio = bio
        db.session.commit()
        return True

    def printUserList():
        users = models.User.query.all()
        for user in users:
            print(
                user.username
                + "\t"
                + user.name
                + "\t"
                + user.email
                + "\t"
                + user.password
            )

    def getPokemon(pokedex_id):
        return models.Pokemon.query.filter_by(pokedex_id=pokedex_id).first()

    def getPokemonReviews(pokedex_id):
        pokemon = DB.getPokemon(pokedex_id=pokedex_id)
        if pokemon:
            return pokemon.reviews

    def getUserReviews(username: str):
        if DB.isUser(username):
            user = DB.getUser(username=username)
            return user.reviews

    def getUserReview(username: str, pokedex_id: str):
        return models.Review.query.filter_by(
            username=username, pokedex_id=pokedex_id
        ).first()

    def addReview(username, pokedex_id, rating, title, body):
        pokemon = models.Pokemon.query.filter_by(pokedex_id=pokedex_id).first()
        if pokemon is None:
            addPokemon = models.Pokemon(pokedex_id=pokedex_id)
            db.session.add(addPokemon)
            db.session.commit()
        review = models.Review(
            rating=rating,
            title=title,
            body=body,
            pokedex_id=pokedex_id,
            username=username,
        )
        db.session.add(review)
        db.session.commit()

    def deleteReview(username, pokedex_id):
        user = models.User.query.filter_by(username=username).first()
        pokemon = models.Pokemon.query.filter_by(pokedex_id=pokedex_id).first()

        for review in user.reviews:
            if review.pokedex_id == pokedex_id:
                user.reviews.remove(review)
                pokemon.reviews.remove(review)
                db.session.delete(review)

        db.session.commit()

    def updateReview(username, pokedex_id, rating, title, body):
        user = models.User.query.filter_by(username=username).first()
        pokemon = models.Pokemon.query.filter_by(pokedex_id=pokedex_id).first()
        updated_review = None

        for review in user.reviews:
            if review.pokedex_id == pokedex_id:
                pokemon.reviews.remove(review)
                user.reviews.remove(review)
                updated_review = review
                updated_review.rating = rating
                updated_review.title = title
                updated_review.body = body

                user.reviews.append(updated_review)
                pokemon.reviews.append(updated_review)
                db.session.commit()

    def jsonifyReviews(reviews):
        if reviews is None:
            return None
        data = {}
        data["reviews"] = []
        if isinstance(reviews, models.Review):
            data["reviews"].append(
                {
                    "id": reviews.id,
                    "username": reviews.username,
                    "pokedex_id": reviews.pokedex_id,
                    "rating": reviews.rating,
                    "title": reviews.title,
                    "body": reviews.body,
                }
            )
            return data
        for review in reviews:
            data["reviews"].append(
                {
                    "id": review.id,
                    "username": review.username,
                    "pokedex_id": review.pokedex_id,
                    "rating": review.rating,
                    "title": review.title,
                    "body": review.body,
                }
            )
        return data

    def jsonifyUser(user):
        data = {}
        if user is None:
            print("not a user")
            data["user"] = {
                "isUser": False,
                "username": "",
                "name": "",
                "img": "",
                "bio": "",
            }
        elif DB.isUser(username=user.username):
            data["user"] = {
                "isUser": True,
                "username": user.username,
                "name": user.name,
                "img": user.img,
                "bio": user.bio,
            }
        else:
            data["user"] = {
                "isUser": False,
                "username": "",
                "name": "",
                "img": "",
                "bio": "",
            }
        return data

    def populate():
        user_list = []
        pokemon_list = []
        pokemon_list_ids = []
        user_count = 10
        pokemon_count = 100
        for i in range(user_count):
            email = "person" + str(i) + "@yahoo.com"
            username = "person" + str(i)
            password = generate_password_hash("123456", method="sha256")
            name = "Bob Ross " + str(i)
            img = "https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg"
            bio = "I love painting. (" + str(i) + ")"
            user_list.append(
                models.User(
                    email=email,
                    username=username,
                    password=password,
                    name=name,
                    img=img,
                    bio=bio,
                )
            )

        for i in range(pokemon_count):
            pokedex_id = randint(1, 700)
            if not (pokedex_id in pokemon_list_ids):
                pokemon_list_ids.append(pokedex_id)
                pokemon_list.append(models.Pokemon(pokedex_id=pokedex_id))

        for id in pokemon_list_ids:
            rand_rating = randint(0, 5)
            rand_user = randint(0, user_count - 1)
            review = models.Review(
                rating=rand_rating,
                title="Review of pokemon #" + str(id),
                body="I may or may not like it :)",
            )
            user_list[rand_user].reviews.append(review)
            pokemon_list[pokemon_list_ids.index(id)].reviews.append(review)

        db.session.add_all(user_list)
        db.session.add_all(pokemon_list)
        db.session.commit()

    def deleteDB():
        db.drop_all()

    def createDB():
        db.create_all()
