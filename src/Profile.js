/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.css';
import propTypes from 'prop-types';
import { getProfile, getReviews, updateProfile } from './Backend';
import { Link, useParams } from 'react-router-dom';

function Profile(props) {
  const { id } = useParams();
  const [username, setUsername] = useState(props.userdata['username']);
  const [name, setName] = useState('');
  const [reviews, updateReviews] = useState('');
  const [bio, setBio] = useState('');
  const [img, setImg] = useState('');
  const [editing, setEdit] = useState(false);
  const [imgField, setImgField] = useState(img);
  const [bioField, setBioField] = useState(bio);

  useEffect(() => {
    if (id) {
      setUsername(id);
      let promise = getProfile(id);
      promise.then((data) => {
        setName(data.user.name);
        setBio(data.user.bio);
        setBioField(data.user.bio);
        setImg(data.user.img);
        setImgField(data.user.img);
      });
    }
  }, []);

  function updateBio() {
    updateProfile(props.userdata['username'], imgField, bioField);
    setBio(bioField);
    setImg(imgField);
    props.setUserData({
      username: props.userdata['username'],
      name: props.userdata['name'],
      img: imgField,
      bio: bioField,
    });
  }
  return (
    <div>
      <h3>{name}&apos;s Profile Page</h3>
      <hr />
      <div>
        <img src={img} width={400} alt={img} />
        <p>
          <b title="UserName">{username}</b>
        </p>
        <p>about: {bio}</p>
        {id === props.userdata['username'] && (
          <button onClick={() => setEdit(true)}>click to edit</button>
        )}
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
        <ReviewList username={username} reviews={reviews} update={updateReviews} />
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
          <div key={review.pokedex_id}>
            <span>
              <h3>
                <Link to={'/pokemon/' + review.pokedex_id}>{review.title}</Link>
              </h3>
              <h5>{review.rating} out of 5</h5>
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
