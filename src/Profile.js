import React, { useState } from 'react';
import './App.css';
import propTypes from 'prop-types';
import { getReviews, updateProfile } from './Backend';
import { Link } from 'react-router-dom';

function Profile(props) {
  const [reviews, updateReviews] = useState('');
  const [bio, setBio] = useState(props.userdata['bio']);
  const [img, setImg] = useState(props.userdata['img']);
  const [editing, setEdit] = useState(false);
  const [imgField, setImgField] = useState(img);
  const [bioField, setBioField] = useState(bio);
  function updateBio() {
    updateProfile(props.userdata['username'], imgField, bioField);
    setBio(bioField);
    setImg(imgField);
    props.setUserData({
      username: props.userdata['username'],
      name: 'Bob Ross 1',
      img: imgField,
      bio: bioField,
    });
  }
  return (
    <div>
      <h3>Profile page of: {props.userdata['name']}</h3>
      <hr />
      <div>
        <img src={img} width={400} alt={img} />
        <p>{bio}</p>
        <button onClick={() => setEdit(true)}>click to edit</button>
        {editing && (
          <div>
            <input
              type="text"
              placeholder={img}
              onInput={(text) => setImgField(text.target.value)}
              maxLength={200} //magic numbers!!!!
            ></input>
            <input
              type="text"
              placeholder={bio}
              onInput={(text) => setBioField(text.target.value)}
              maxLength={256} //magic numbers!!!!
            ></input>
            <button onClick={() => setEdit(false)}>cancel</button>
            <button onClick={() => updateBio()}>submit</button>
          </div>
        )}
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
  setUserData: propTypes.func,
};

function ReviewList(props) {
  let promise = getReviews(props.username);
  promise.then((data) => {
    props.update(JSON.stringify(data));
  });
  if (!props.reviews) {
    return <div></div>;
  }
  const data = JSON.parse(props.reviews);
  return (
    <div>
      {data['reviews'].map((review) => {
        return (
          <div>
            <span>
              <h3>
                <Link to={'/pokemon/' + review.pokedex_id}>{review.title}</Link>
              </h3>
              <h5>{review.rating} out of 10</h5>
            </span>
            <span>Pokedex_id: {review.pokedex_id}</span>
            <span> by {review.username}</span>
            <div>{review.body}</div>
          </div>
        );
      })}
    </div>
  );
}

ReviewList.propTypes = {
  username: propTypes.string,
  reviews: propTypes.string,
  update: propTypes.func,
};

export default Profile;
