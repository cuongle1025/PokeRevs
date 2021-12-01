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
import './Help.css';

const Help = function Help({ userdata }) {
    return (
        <Container className="mt-2">
            <Row className="box-shadowed-body">
                <Col md={{ span: 2 }} className="p-0"></Col>

                <Col xs={7}>
                    <div className="text-center">
                        <h1> Welcome to PokeRevs!</h1>
                        <p>Review your favorite(or least favorite) Pokemon.</p>
                    </div>
                    <div>
                        <p> This is the Help page. It contains an explanation of PokeRev's features
                            and how to use them.
                        </p>
                    </div>
                    <div>
                        <h3>Profile</h3>
                        <p>Before you start reviewing, please edit your profile.
                            You can change your username, add a profile picture, and update your bio.
                            Additionally, a list of your reviews can be accessed on your Profile page.
                        </p>
                        <p>You can edit your profile anytime by visiting the Profile page
                            and pressing the "Edit Profile" button.
                        </p>
                        <Link to={`/profile/${userdata.user_id}`}>
                            <Button>Go to My Profile</Button>
                        </Link>
                        <p>You can visit you fellow reviewers’ Profile pages as well.
                            Every review has a link to its author’s Profile page.
                        </p>
                        <Row>
                            <Col md={{ span: 1 }} className="p-0"></Col>
                            <h5>Changing profile image</h5>
                            <p>Currently, only image URLs are accepted. Please enter an image URL
                                into the corresponding textbox labled "Profile Image"
                            </p>
                        </Row>
                    </div>

                    <div>
                        <h4>Search</h4>
                        <p>To view a Pokemon’s reviews and write you own, go to the search page.
                            Here, there is a textbox where you can type either the Pokemon’s name or their numerical ID.
                            Then press the search button.
                            If the Pokemon has a space in its name, please use a hyphen instead
                            or the search will fail.
                        </p>
                        <p>After searching a Pokemon, you can leave a review
                            by pressing the "leave review" button
                        </p>
                        <Link to={`/search/`}>
                            <Button>Try Searching</Button>
                        </Link>
                    </div>

                    <div>
                        <h4>Compare</h4>
                        <p>PokeRevs has a cool feature that allows you to compare two Pokemon side by side!
                            To try it, go to the compare page and choose two Pokemon you want to compare
                            by typing their names or IDs into the textboxes. Then press the compare button.
                            If the Pokemon has a space in its name, please use a hyphen instead
                            or the search will fail.
                        </p>
                        <p>The compare feature will palce the attributes, such as their stats and movesets,
                            of the two Pokemon side by side.
                        </p>
                        <Link to={`/compare/`}>
                            <Button>Try Comparing</Button>
                        </Link>
                    </div>

                    <div>
                        <h4>Users</h4>
                        <p>You can view the list of users ordered by User ID.
                            Inputing a number in the textbox and pressing the "Search" button will
                            jump to that User ID.
                        </p>
                        <p>"Limit" determines how many users will appear
                            on the screen. Clicking on it will open a drop down menu where
                            you can choose a number.
                        </p>
                        <p>The "X" button will clear the search.</p>
                        <p>Clicking on a user will take you to their Profile</p>
                        <Link to={`/users/`}>
                            <Button>View User List</Button>
                        </Link>
                    </div>

                    <div>
                        <h4></h4>
                        <p></p>
                    </div>

                </Col>
            </Row>
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