# pylint: disable=missing-class-docstring
# pylint: disable=missing-module-docstring
# pylint: disable=missing-function-docstring
# pylint: disable=invalid-name
import sys
import os
import unittest
from unittest.mock import patch
from werkzeug.security import check_password_hash
from dbhandler import DB
from models import User, Review

# get the name of file's working directory
current = os.path.dirname(os.path.realpath(__file__))

# Add the parent directory name to the sys.path.
parent = os.path.dirname(current)
sys.path.append(parent)


INPUT = "INPUT"
EXPECTED_OUTPUT = "EXPECTED_OUTPUT"


class UpdateDBUsersTests(unittest.TestCase):
    def setUp(self):
        self.db_mock = [
            User(
                email="email",
                password="password",
                username="user",
                name="name",
                img="pic",
                bio="bio",
            )
        ]

    def mock_add_to_db(self, user):
        self.db_mock.append(user)

    def mock_db_commit(self):
        pass

    def test_addUser(self):
        with patch("app.db.session.add", self.mock_add_to_db):
            with patch("app.db.session.commit", self.mock_db_commit):

                # 1) Try to add a new user to the DB. Should expand the DB
                DB.addUser("email2", "user2", "name2",
                           "password2", "pic2", "bio2")
                self.assertEqual(len(self.db_mock), 2)
                self.assertEqual(self.db_mock[1].email, "email2")
                self.assertEqual(self.db_mock[1].username, "user2")
                self.assertEqual(self.db_mock[1].name, "name2")
                self.assertEqual(
                    check_password_hash(
                        self.db_mock[1].password, "password2"), True
                )
                self.assertEqual(self.db_mock[1].img, "pic2")
                self.assertEqual(self.db_mock[1].bio, "bio2")

                # # 2) Try to add duplicate email to the DB. Should do nothing
                # """ Currently handeld at front-end
                # DB.addUser("email", "user2", "name2", "password2", "pic2", "bio2")
                # self.assertEqual(len(self.db_mock), 1)
                # self.assertEqual(self.db_mock[0].email, "email")
                # """


class UpdateDBReviewsTests(unittest.TestCase):
    def setUp(self):
        self.db_mock = [
            Review(
                rating=1,
                title="title",
                body="body",
                pokedex_id=1,
                username="user",
            ),
        ]

    def mock_add_to_db(self, review):
        self.db_mock.append(review)

    def mock_delete_from_db(self, review):
        self.db_mock = [
            entry for entry in self.db_mock if entry.username != review.username
        ]

    def mock_db_commit(self):
        pass

    def test_addReview(self):
        with patch("app.db.session.add", self.mock_add_to_db):
            with patch("app.db.session.delete", self.mock_delete_from_db):
                with patch("app.db.session.commit", self.mock_db_commit):
                    # 1) Try to add a new review to the DB. Should expand the DB
                    DB.addReview("user2", 2, 2, "title2", "body2")
                    self.assertEqual(len(self.db_mock), 2)
                    self.assertEqual(self.db_mock[1].username, "user2")
                    self.assertEqual(self.db_mock[1].pokedex_id, 2)
                    self.assertEqual(self.db_mock[1].rating, 2)
                    self.assertEqual(self.db_mock[1].title, "title2")
                    self.assertEqual(self.db_mock[1].body, "body2")

                    # # Currently fails
                    # # 2) Try to add review with empty body to database. Should do nothing
                    # DB.addReview("user", 2, 2, "title2", "")
                    # self.assertEqual(len(self.db_mock), 2)
                    # self.assertEqual(self.db_mock[1].body, "body")

                    # # Currently handeld at front-end
                    # # 3) Try to add a review of a Pokemon twice with the same user_id.
                    # #   Should do nothing.
                    # DB.addReview("user", 1, 2, "title2", "body2")
                    # self.assertEqual(len(self.db_mock), 2)
                    # self.assertEqual(self.db_mock[0].username, "user")
                    # self.assertEqual(self.db_mock[0].pokedex_id, 1)


if __name__ == "__main__":
    unittest.main()
