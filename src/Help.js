import React from 'react';
import {
    Form,
    Button,
    Container,
    Row,
    Col,
    Stack,
    Collapse,
    Modal,
    OverlayTrigger,
    Popover,
} from 'react-bootstrap/';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Help = function Help({ userdata }) {
    return (
        <Container className="mt-2">
            <div>
                <div className="text-center">
                    <h1> Welcome to PokeRevs!</h1>
                    <p>Review your favorite(or least favorite) Pokemon.</p>
                </div>

                <div>
                    <h4>Profile</h4>
                    <p>Before you start reviewing, please edit your profile.
                        You can change your username, add a profile picture, and update your bio.
                        You can also see a list of your reviews on your profile page.</p>
                    <p>You can visit you fellow reviewers’ profile pages as well. Every review has a link to its author’s profile page.
                    </p>
                    <Link to={`/profile/${userdata.user_id}`}>
                        <Button>Go to My Profile</Button>
                    </Link>
                </div>

                <div>
                    <h4>Search</h4>
                    <p>To view a Pokemon’s reviews and write you own, go to the search page.
                        Here, there is a textbox where you can type either the Pokemon’s name or their numerical ID.
                        Then press the search button.
                    </p>
                    <p>After searching a Pokemon, you can leave a review
                        Just press the leave review button
                    </p>
                    <Link to={`/search/`}>
                        <Button>Try Searching</Button>
                    </Link>
                </div>

                <div>
                    <h4>Compare</h4>
                    <p>PokeRev’s has a cool feature that allows you to compare two Pokemon side by side!
                        To try it, go to the compare page and choose two Pokemon you want to compare. Then press the compare button.
                        The items compared are:
                        Stats
                        Number of reviews
                        Ability
                        Moveset
                    </p>
                    <Link to={`/compare/`}>
                        <Button>Try Comparing</Button>
                    </Link>
                </div>

                <div>
                    <h4>Users</h4>
                    <p>You can view the list of users. </p>
                    <Link to={`/users/`}>
                        <Button>View User List</Button>
                    </Link>
                </div>

                <div>
                    <h4></h4>
                    <p></p>
                </div>

            </div>
        </Container>
    );
}

export default Help;

Help.propTypes = {
    userdata: propTypes.object,
};

Help.defaultProps = {
    userdata: { name: '' },
};