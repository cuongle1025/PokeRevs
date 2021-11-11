import React, { useState } from 'react';
import './App.css';
import propTypes from 'prop-types';
import { getReviews } from './Backend';

function Profile(props) {
  const [reviews, updateReviews] = useState('none');
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
        <ReviewList
          username={props.userdata['username']}
          reviews={reviews}
          update={updateReviews}
        />
      </div>
    </div>
  );
}

Profile.propTypes = {
  userdata: propTypes.object,
};

function ReviewList(props) {
  let promise = getReviews(props.username);
  promise.then((data) => props.update(JSON.stringify(data)));
  return <div>{props.reviews}</div>;
}

ReviewList.propTypes = {
  username: propTypes.string,
  reviews: propTypes.string,
  update: propTypes.func,
};

export default Profile;
