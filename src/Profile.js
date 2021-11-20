/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.css';
import propTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { getProfile, getReviews, updateProfile } from './Backend';

const Profile = function (props) {
  const { id } = useParams();
  const [user_id, setUser_id] = useState(props.userdata.user_id);
  const [name, setName] = useState(props.userdata.name);
  const [reviews, updateReviews] = useState('');
  const [bio, setBio] = useState('');
  const [img, setImg] = useState('');
  const [editing, setEdit] = useState(false);
  const [nameField, setNameField] = useState('');
  const [imgField, setImgField] = useState(img);
  const [bioField, setBioField] = useState(bio);

  useEffect(() => {
    if (id) {
      setUser_id(id);
      const promise = getProfile(id);
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
    const nameUpdate = nameField !== '' ? nameField : name;
    const bioUpdate = bioField !== '' ? bioField : bio;
    const imgUpdate = imgField !== '' ? imgField : img;
    updateProfile(props.userdata.user_id, nameUpdate, imgUpdate, bioUpdate);
    setName(nameUpdate);
    setBio(bioUpdate);
    setImg(imgUpdate);
    props.setUserData({
      user_id: props.userdata.user_id,
      name: nameUpdate,
      img: bioUpdate,
      bio: imgUpdate,
    });
  }
  return (
    <div>
      <h3>
        {name}
        &apos;s Profile Page
      </h3>
      <hr />
      <div>
        <img src={img} width={400} alt={img} />
        <p>
          <b title="TestName">{name}</b>
        </p>
        <p>
          about:
          {bio}
        </p>
        {id === props.userdata.user_id && (
          <button type="button" onClick={() => setEdit(true)}>
            click to edit
          </button>
        )}
        {editing && (
          <div>
            <input
              type="text"
              placeholder={`Edit name: ${name}`}
              onInput={(text) => setNameField(text.target.value)}
              maxLength={200}
            />
            <br />
            <input
              type="text"
              placeholder={`Edit image: ${img}`}
              onInput={(text) => setImgField(text.target.value)}
              maxLength={200}
            />
            <br />
            <input
              type="text"
              placeholder={`Edit Bio: ${bio}`}
              onInput={(text) => setBioField(text.target.value)}
              maxLength={256}
            />
            <br />
            <button type="button" onClick={() => setEdit(false)}>
              cancel
            </button>
            <button type="button" onClick={() => updateBio()}>
              submit
            </button>
          </div>
        )}
      </div>
      <hr />
      <div>
        <h4>- Reviews -</h4>
        <ReviewList user_id={user_id} reviews={reviews} update={updateReviews} />
      </div>
    </div>
  );
};

Profile.propTypes = {
  userdata: propTypes.object,
  setUserData: propTypes.func,
};

const ReviewList = function (props) {
  const promise = getReviews(props.user_id);
  promise.then((data) => {
    props.update(JSON.stringify(data));
  });
  if (!props.reviews) {
    return <div />;
  }
  const data = JSON.parse(props.reviews);
  return (
    <div>
      {data.reviews.map((review) => (
        <div key={review.pokedex_id}>
          <span>
            <h3>
              <Link to={`/pokemon/${review.pokedex_id}`}>{review.title}</Link>
            </h3>
            <h5>{`${review.rating} out of 5`}</h5>
          </span>
          <span>
            Pokedex_id:
            {review.pokedex_id}
          </span>
          <span>
            {' '}
            by
            {review.name}
          </span>
          <div>{review.body}</div>
        </div>
      ))}
    </div>
  );
};

ReviewList.propTypes = {
  user_id: propTypes.string,
  reviews: propTypes.string,
  update: propTypes.func,
};

export default Profile;
