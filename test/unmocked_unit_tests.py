# pylint: disable=missing-class-docstring
# pylint: disable=missing-module-docstring
# pylint: disable=missing-function-docstring
# pylint: disable=invalid-name
import sys
import os
import unittest
from dbhandler import DB
from models import User, Review

# get the name of file's working directory
current = os.path.dirname(os.path.realpath(__file__))

# Add the parent directory name to the sys.path.
parent = os.path.dirname(current)
sys.path.append(parent)


INPUT = "INPUT"
EXPECTED_OUTPUT = "EXPECTED_OUTPUT"


def getReviews():
    results = Review.query.all()
    return results


def getUser():
    result = User.query.first()
    return result


reviews = getReviews()
user = getUser()


class JsonifyReviewsTests(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                # Test jsonifyReviews with a list of reviews as input
                INPUT: [reviews[0], reviews[1]],
                EXPECTED_OUTPUT: {
                    "reviews": [
                        {
                            "id": reviews[0].id,
                            "username": reviews[0].username,
                            "pokedex_id": reviews[0].pokedex_id,
                            "rating": reviews[0].rating,
                            "title": reviews[0].title,
                            "body": reviews[0].body,
                        },
                        {
                            "id": reviews[1].id,
                            "username": reviews[1].username,
                            "pokedex_id": reviews[1].pokedex_id,
                            "rating": reviews[1].rating,
                            "title": reviews[1].title,
                            "body": reviews[1].body,
                        },
                    ]
                },
            },
        ]

    def test_jsonifyReviews(self):
        for test in self.success_test_params:
            self.assertEqual(DB.jsonifyReviews(
                test[INPUT]), test[EXPECTED_OUTPUT])


class JsonifyUserTests(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                # Test jsonifyUser
                INPUT: user,
                EXPECTED_OUTPUT: {
                    "user": {
                        "isUser": True,
                        "username": user.username,
                        "name": user.name,
                        "img": user.img,
                        "bio": user.bio,
                    },
                },
            },
        ]

    def test_jsonifyUser(self):
        for test in self.success_test_params:
            self.assertEqual(DB.jsonifyUser(
                test[INPUT]), test[EXPECTED_OUTPUT])


if __name__ == "__main__":
    unittest.main()
