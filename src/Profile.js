/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { InputGroup, FormControl, Button, Col, Row, Container, Stack } from 'react-bootstrap/';
import { Rating, Avatar } from '@mui/material/';
import './App.css';
import propTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { getProfile, getReviews, updateProfile } from './Backend';

const Profile = function Profile(props) {
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
      <Container className="m-4">
        <Row>
          <Col md={{ span: 3, offset: 6 }} className="shadow-sm">
            <p className="h3">{`${name}'s Profile Page`}</p>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 4, offset: 1 }}>
            <div className="shadow-sm p-3 m-2">
              <div className="d-flex flex-column justify-content-center">
                <div className="p-2">
                  <Avatar
                    alt={name}
                    src={img}
                    sx={{ width: 128, height: 128 }}
                    style={{ border: '2px solid lightgray' }}
                    className="shadow"
                  />
                </div>
                <div className="p-2">
                  <blockquote className="blockquote">
                    <p className="mb-2">{bio}</p>
                    <footer className="blockquote-footer">
                      <cite>
                        <b title="TestName">{name}</b>
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              </div>
              {id === props.userdata.user_id && (
                <Button
                  className="my-3"
                  variant="primary"
                  type="button"
                  onClick={() => setEdit(!editing)}
                >
                  Edit Profile
                </Button>
              )}
              {editing && (
                <div className="shadow-sm">
                  <InputGroup className="mb-2">
                    <InputGroup.Text id="NameFormControl">Name</InputGroup.Text>
                    <FormControl
                      type="text"
                      placeholder={name}
                      aria-label="Name"
                      aria-describedby="NameFormControl"
                      onChange={(text) => setNameField(text.target.value)}
                      maxLength={128}
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text id="ImgFormControl">Profile Image</InputGroup.Text>
                    <FormControl
                      type="text"
                      placeholder={img}
                      aria-label="Profile Image"
                      aria-describedby="ImgFormControl"
                      onChange={(text) => setImgField(text.target.value)}
                      maxLength={199}
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text id="BioFormControl">Personal Bio</InputGroup.Text>
                    <FormControl
                      as="textarea"
                      aria-label="Personal Bio"
                      placeholder={bio}
                      onChange={(text) => setBioField(text.target.value)}
                      maxLength={255}
                    />
                  </InputGroup>
                  <Button variant="success" type="button" onClick={() => updateBio()}>
                    Submit Changes
                  </Button>
                </div>
              )}
            </div>
          </Col>
          <Col md={{ span: 6, offset: 1 }} className="shadow-sm ml-3">
            <h4>- Reviews -</h4>
            <ReviewList user_id={user_id} reviews={reviews} update={updateReviews} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Profile.propTypes = {
  userdata: propTypes.object,
  setUserData: propTypes.func,
};

const ReviewList = function ReviewList(props) {
  const promise = getReviews(props.user_id);
  promise.then((data) => {
    props.update(JSON.stringify(data));
  });
  if (!props.reviews) {
    return <div />;
  }
  const data = JSON.parse(props.reviews);
  return (
    <Stack gap={3}>
      {data.reviews.map((review) => (
        <div key={review.pokedex_id}>
          <Stack direction="horizontal" gap={2}>
            <Rating name="read-only" value={review.rating} size="small" readOnly />
            <p className="fw-bold title">
              <Link to={`/pokemon/${review.pokedex_id}`}>{`${review.title}`}</Link>
            </p>
          </Stack>
          <p>{review.body}</p>
        </div>
      ))}
    </Stack>
  );
};

ReviewList.propTypes = {
  user_id: propTypes.string,
  reviews: propTypes.string,
  update: propTypes.func,
};

export default Profile;
