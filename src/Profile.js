import React from 'react';
import './App.css';
import propTypes from 'prop-types';
//import { getReviews } from './Backend';

function Profile(props) {
  return (
    <div>
      <h3>Profile page of: {props.userdata['name']}</h3>
      <hr />
      <div>
        <img src={props.userdata['img']} />
        <p>{props.userdata['bio']}</p>
      </div>
      <hr />
      <div>
        <h4>- Reviews -</h4>
        <ReviewList username={props.userdata['username']} />
      </div>
    </div>
  );
}

Profile.propTypes = {
  userdata: propTypes.object,
};

function ReviewList() {
  return <div>reviews here</div>;
}

ReviewList.propTypes = {
  username: propTypes.string,
};

export default Profile;
