# pylint: disable=invalid-name
# pylint: disable=missing-function-docstring
# pylint: disable=too-many-public-methods
"""POKEREVS"""
import json
import secrets
from random import randint
from faker import Faker
import requests
from werkzeug.security import generate_password_hash
from sqlalchemy import desc
import models
from init import db, app


class DB:
    # pylint: disable=no-self-argument
    # pylint: disable=no-member
    # pylint: disable=missing-class-docstring
    # pylint: disable=missing-module-docstring
    # pylint: disable=too-many-arguments
    # pylint: disable=no-method-argument
    def addUser(email, name, password, img, bio):
        # create a new user with hashed password
        new_user = models.User(
            email=email,
            password=generate_password_hash(password, method='pbkdf2:sha256'),
            name=name,
            img=img,
            bio=bio,
        )

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()

    def addGoogleUser(email, name, img, bio):
        new_user = models.User(email=email, name=name, img=img, bio=bio)
        db.session.add(new_user)
        db.session.commit()

    def getUser(user_id):
        return models.User.query.filter_by(user_id=user_id).first()

    def isUser(user_id):
        return len(models.User.query.filter_by(user_id=user_id).all()) != 0

    def isGoogleOnlyUser(email):
        return models.User.query.filter_by(email=email).first().password is None

    def isUserByEmail(email):
        return len(models.User.query.filter_by(email=email).all()) != 0

    def getUserByEmail(email):
        return models.User.query.filter_by(email=email).first()

    def updateProfile(user_id, name, img, bio):
        user = models.User.query.filter_by(user_id=user_id).first()
        if not user:
            return False
        user.name = name
        user.img = img
        user.bio = bio
        db.session.commit()
        return True

    def printUserList():
        users = models.User.query.all()
        for user in users:
            print(str(user.user_id) + "\t" + user.name + "\t" + user.email)

    def getPokemon(pokedex_id):
        return models.Pokemon.query.filter_by(pokedex_id=pokedex_id).first()

    # ignore this function for now,
    # it calculates the average rating of all pokemon in the db atm
    def printPokemonReviews():
        pokemon_list = models.Pokemon.query.all()
        ratings = []
        for pokemon in pokemon_list:
            average = 0
            current_ratings = []
            for review in pokemon.reviews:
                average += review.rating
                current_ratings.append(review.rating)
            average = int(average / len(pokemon.reviews))
            ratings.append(
                {
                    "pokedex_id": pokemon.pokedex_id,
                    "average": average,
                    "all_scores": current_ratings,
                }
            )
        output = ""
        for pokemon in ratings:
            output = f"""{output}\n{pokemon['pokedex_id']}.
             average: {pokemon['average']} out of 5 
            ({pokemon['all_scores']})"""
        print(output)

    def getPokemonReviews(pokedex_id):
        pokemon = DB.getPokemon(pokedex_id=pokedex_id)
        if pokemon:
            return pokemon.reviews
        return None

    def getUserReviews(user_id: int):
        if DB.isUser(user_id):
            user = DB.getUser(user_id=user_id)
            return user.reviews
        return None

    def getUserReview(user_id: str, pokedex_id: str):
        return models.Review.query.filter_by(
            user_id=user_id, pokedex_id=pokedex_id
        ).first()

    def getTopReviews():
        return models.Review.query.order_by(desc(models.Review.rating)).limit(20).all()
        # return models.User.query.all()

    def addReview(user_id, pokedex_id, rating, title, body):
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
            user_id=user_id,
        )
        db.session.add(review)
        db.session.commit()

    # pylint: disable=useless-return
    def deleteReview(user_id, pokedex_id):
        review = models.Review.query.filter_by(
            user_id=user_id, pokedex_id=pokedex_id
        ).first()
        db.session.delete(review)
        db.session.commit()
        return None

    def editReview(user_id, pokedex_id, rating, title, body):
        review = models.Review.query.filter_by(
            user_id=user_id, pokedex_id=pokedex_id
        ).first()
        review.rating = rating
        review.title = title
        review.body = body
        db.session.commit()

    def jsonifyReviews(reviews):
        # pylint: disable=not-an-iterable
        if reviews is None:
            return None
        data = {}
        data["reviews"] = []
        # For current user review
        if isinstance(reviews, models.Review):
            data["reviews"].append(
                {
                    "id": reviews.id,
                    "name": reviews.user.name,
                    "img": reviews.user.img,
                    "time": reviews.time,
                    "user_id": reviews.user_id,
                    "pokedex_id": reviews.pokedex_id,
                    "rating": reviews.rating,
                    "title": reviews.title,
                    "body": reviews.body,
                }
            )
            return data
        # For getting list of reviews
        for review in reviews:
            data["reviews"].append(
                {
                    "id": review.id,
                    "name": review.user.name,
                    "img": review.user.img,
                    "time": review.time,
                    "user_id": review.user_id,
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
            data["user"] = {
                "isUser": False,
                "user_id": -1,
                "name": "",
                "img": "",
                "bio": "",
                "review_count": "0",
            }
        elif DB.isUser(user_id=user.user_id):
            data["user"] = {
                "isUser": True,
                "user_id": user.user_id,
                "name": user.name,
                "img": user.img,
                "bio": user.bio,
                "review_count": len(user.reviews),
            }
        else:
            data["user"] = {
                "isUser": False,
                "user_id": -1,
                "name": "",
                "img": "",
                "bio": "",
                "review_count": "0",
            }
        return data

    def jsonifyTopReviews(reviews):
        data = {}
        data["reviews"] = []
        # pylint: disable=not-an-iterable
        for review in reviews:
            data["reviews"].append(
                {
                    "id": review.id,
                    "rating": review.rating,
                    "title": review.title,
                    "body": review.body,
                }
            )
        return data

    def populate():
        # pylint: disable=too-many-locals
        fake = Faker()
        Faker.seed(0)
        user_list = []
        pokemon_list = []
        user_count = 100
        max_pokedex_id = 890
        min_reviews_per_pokemon = 4
        max_reviews_per_pokemon = 12
        positive_adverbs = [
            'boldly',
            'bravely',
            'brightly',
            'cheerfully',
            'deftly',
            'devotedly',
            'eagerly',
            'elegantly',
            'faithfully',
            'fortunately',
            'gleefully',
            'gracefully',
            'happily',
            'honestly',
            'innocently',
            'kindly',
            'merrily',
            'obediently',
            'perfectly',
            'politely',
            'powerfully',
            'safely',
            'victoriously',
            'warmly',
            'vivaciously',
        ]

        negative_adverbs = [
            "achingly",
            "angrily",
            "annoyingly",
            "anxiously",
            "badly",
            "boastfully",
            "dejectedly",
            "enviously",
            "foolishly",
            "hopelessly",
            "irritably",
            "jealously",
            "joylessly",
            "lazily",
            "miserably",
            "morosely",
            "obnoxiously",
            "painfully",
            "poorly",
            "rudely",
            "sadly",
            "selfishly",
            "terribly",
            "unhappily",
            "wearily",
        ]

        neutral_adverbs = [
            "accidentally",
            "awkwardly",
            "blindly",
            "coyly",
            "crazily",
            "defiantly",
            "deliberately",
            "doubtfully",
            "dramatically",
            "dutifully",
            "enormously",
            "excitedly",
            "hungrily",
            "mortally",
            "mysteriously",
            "nervously",
            "seriously",
            "shakily",
            "restlessly",
            "solemnly",
            "sternly",
            "unexpectedly",
            "wildly",
        ]
        positive_adjectives = [
            'affectionate',
            'agreeable',
            'amiable',
            'bright',
            'charming',
            'creative',
            'determined',
            'diligent',
            'diplomatic',
            'dynamic',
            'energetic',
            'friendly',
            'funny',
            'generous',
            'giving',
            'gregarious',
            'hardworking',
            'helpful',
            'imaginative',
            'kind',
            'likable',
            'loyal',
            'patient',
            'polite',
            'sincere',
        ]

        negative_adjectives = [
            'arrogant',
            'obstinate',
            'moody',
            'impolite',
            'sneaky',
            'big-headed',
            'resentful',
            'cruel',
            'machiavellian',
            'aloof',
            'pompous',
            'cowardly',
            'intolerant',
            'silly',
            'overcritical',
            'dishonest',
            'finicky',
            'possessive',
            'untrustworthy',
            'secretive',
            'domineering',
            'inflexible',
            'tactless',
            'unreliable',
            'inconsiderate',
            'hostile',
            'deceitful',
            'stubborn',
            'impatient',
            'careless',
            'foolish',
            'touchy',
            'vulgar',
        ]

        for _ in range(user_count):
            current = fake.profile()
            email = current["mail"]
            password = generate_password_hash("123456", method='pbkdf2:sha256')
            name = current["name"]
            img = "https://i.imgur.com/DFCgM3b.jpg"
            bio = f"""Day time {current['job']} at {current['company']}, night time reviewer.
            \n{fake.sentence(nb_words=8, variable_nb_words=False)}"""

            choice = randint(0, 2)
            if choice == 0:
                img = "https://i.imgur.com/yivQc38.jpg"
                name = f"{name} {fake.suffix_nonbinary()}"
            elif choice == 1:
                api_img_url = "https://api.thecatapi.com/v1/images/search"
                response = requests.get(api_img_url)
                # img = json.loads(requests.get(api_img_url).content)[0]["url"]
                img = response.json()[0]["url"]
                name = f"{fake.prefix_nonbinary()} {name}, {fake.suffix_nonbinary()}"

            user_list.append(
                models.User(
                    email=email, password=password, name=name, img=img, bio=bio,
                )
            )

        for i in range(1, max_pokedex_id + 1):
            num_reviews = randint(min_reviews_per_pokemon,
                                  max_reviews_per_pokemon)
            pokemon_list.append(models.Pokemon(pokedex_id=i))
            for _ in range(1, num_reviews):
                rand_user = randint(0, user_count - 1)
                rand_rating = randint(1, 5)
                if rand_rating > 3:
                    adverb = secrets.choice(positive_adverbs)
                    adjective = secrets.choice(positive_adjectives)
                    start = secrets.choice([
                        f"""I had a great time working with this Pokemon.
                         It really performs very {adverb}.
                        \n\nVery {adjective} around other Pokemon,
                         making it flexible for the team.""",
                        f"""I can't believe I've lived without this one for so long!
                        \nIt does the chores around the house incredibly {adverb}.
                         You have to try it out!""",
                        f"""Underrated Pokemon. After spending some time with it,
                         you'll find out how {adverb} it fights.
                         A very {adjective} species to top it off!!!""",
                        f"""It's all been said before, don't only take my word for it. 
                         You won't regret it. {adjective} af.""",
                    ])
                elif rand_rating < 3:
                    adverb = secrets.choice(negative_adverbs)
                    adjective = secrets.choice(negative_adjectives)
                    start = secrets.choice([
                        f"""Before you buy this one, I suggest you look around first.
                         I didn't know it worked {adverb} around other Pokemon.
                         Starts are nice, but personality is a 0.""",
                        f"""Overrated Pokemon. When I'm at home it behaves fine, 
                         but otherwise it's {adjective} and that causes a
                         lot of problems. Would not recommend.""",
                        f"""Before you scroll away, there is a reason for the score--
                        It plays very {adverb} in practice.
                         Can't say that bodes well for the future.""",
                        f"""One word to describe this Pokemon: {adjective}.
                        \nIt's a deal-breaker for me.
                         If you can tolerate that, then I say go for it.""",
                        """Works for the first 3 months, then it broke.
                         Seeing if I can get my Pokédollars back.""",
                    ])
                else:
                    adverb = secrets.choice(neutral_adverbs)
                    start = secrets.choice([
                        f"""It just werks. Doesn't stand out but still decent.
                         It likes to act {adverb}.""",
                        f"""HIGHLY overrated, but not entirely unusable.
                         I say, go for it. Be careful though,
                         sometimes it likes to stand around {adverb}.""",
                        f"""Do more research before selecting this one folks!
                         It doesn't work everywhere,
                         especially since {adverb} runs away from time to time.
                        \nThat being said, It works in a few of my teams.""",
                        "Meh.",
                    ])
                review = models.Review(
                    rating=rand_rating,
                    title=f"""Review of Pokemon #{i}
                     - {fake.sentence(nb_words=4, variable_nb_words=False)}""",
                    body=f"{start}\n\n{fake.sentence(nb_words=20, variable_nb_words=False)}",
                )
                user_list[rand_user].reviews.append(review)
                pokemon_list[i - 1].reviews.append(review)

        db.session.add_all(user_list)
        db.session.add_all(pokemon_list)
        db.session.commit()

    def deleteDB():
        db.drop_all()

    def createDB():
        with app.app_context():
            db.create_all()
