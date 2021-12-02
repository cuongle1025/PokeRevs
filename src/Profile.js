/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import {
  InputGroup,
  FormControl,
  Button,
  Col,
  Row,
  Collapse,
  Stack,
  Offcanvas,
} from 'react-bootstrap/';
import './Profile.css';
import { Rating, Avatar } from '@mui/material/';
import propTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { getProfile, getReviews, updateProfile } from './Backend';

const Profile = function Profile(props) {
  const { id } = useParams();
  const [user_id, setUser_id] = useState(props.userdata.user_id);
  const [name, setName] = useState(props.userdata.name);
  const [reviews, updateReviews] = useState('');
  const [bio, setBio] = useState('');
  const [img, setImg] = useState('../static/wobbuffet.png');
  const [editing, setEdit] = useState(false);
  const [expandReviews, setExpandReviews] = useState(false);
  const nameField = useRef('');
  const imgField = useRef(img);
  const bioField = useRef(bio);
  const preSaveBio = useRef(bio);

  useEffect(() => {
    if (id) {
      setUser_id(id);
      const promise = getProfile(id);
      promise.then((data) => {
        setName(data.user.name);
        nameField.current = data.user.name;
        setBio(data.user.bio);
        bioField.current = data.user.bio;
        setImg(data.user.img);
        imgField.current = data.user.img;
        preSaveBio.current = data.user.bio;
      });
    }
  }, []);

  function updateBio() {
    const nameUpdate = nameField.current !== '' ? nameField.current : name;
    const bioUpdate = bioField.current !== '' ? bioField.current : preSaveBio.current;
    const imgUpdate = imgField.current !== '' ? imgField.current : img;
    preSaveBio.current = bioField.current !== '' ? bioField.current : preSaveBio.current;
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
      <Row className="no-mp">
        <Col md={{ span: 1 }} />
        <Col md={{ span: 10 }}>
          <Row>
            <Col md={{ span: 12 }}>
              <div className="mt-4 p-3 box-shadowed bordered" id="profile-top">
                <div className="py-3 px-3">
                  <Avatar
                    alt={name}
                    src={img.length > 0 ? img : '../static/wobbuffet.png'}
                    sx={{ width: 256, height: 256 }}
                    style={{ border: '3px solid black' }}
                  />
                </div>
                <div className="vr" />
                <div className="d-flex flex-column py-3 px-3 align-items-center">
                  <div className="size-40 mb-3 text-center" title="TestName">
                    {name}
                  </div>
                  <div className="poke-gen1-box mb-4">
                    <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{bio}</pre>
                    <i />
                  </div>
                </div>
                {id === props.userdata.user_id && (
                  <div className="py-3 px-3" style={{ marginLeft: 'auto' }}>
                    <span>
                      <Button
                        className="mb-3"
                        variant="primary"
                        type="button"
                        onClick={() => {
                          setEdit(!editing);
                          document.getElementById('name-field').focus();
                        }}
                        aria-controls="collapse-form"
                        aria-expanded={editing}
                      >
                        Edit Profile
                      </Button>
                      <Offcanvas
                        name="Enable body scrolling"
                        placement="end"
                        scroll
                        show={editing}
                        onHide={() => {
                          setEdit(!editing);
                          setBio(preSaveBio.current);
                        }}
                      >
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title className="oswald" style={{ fontSize: '40px' }}>
                            Edit your Profile
                          </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="oswald">
                          <InputGroup className="mb-2">
                            <InputGroup.Text id="NameFormControl">Name</InputGroup.Text>
                            <FormControl
                              type="text"
                              placeholder={name}
                              aria-label="Name"
                              aria-describedby="NameFormControl"
                              onChange={(text) => {
                                nameField.current = text.target.value;
                              }}
                              maxLength={128}
                              id="name-field"
                            />
                          </InputGroup>
                          <InputGroup className="mb-2">
                            <InputGroup.Text id="ImgFormControl">Profile Image</InputGroup.Text>
                            <FormControl
                              type="text"
                              placeholder={img}
                              aria-label="Profile Image"
                              aria-describedby="ImgFormControl"
                              onChange={(text) => {
                                imgField.current = text.target.value;
                              }}
                              maxLength={199}
                            />
                          </InputGroup>
                          <InputGroup className="mb-2">
                            <InputGroup.Text id="BioFormControl">Personal Bio</InputGroup.Text>
                            <FormControl
                              as="textarea"
                              aria-label="Personal Bio"
                              placeholder={bio}
                              onChange={(text) => {
                                bioField.current = text.target.value;
                                setBio(bioField.current);
                              }}
                              maxLength={255}
                            />
                          </InputGroup>
                          <Button
                            variant="success"
                            type="button"
                            onClick={() => {
                              updateBio();
                              setEdit(!editing);
                            }}
                          >
                            Submit Changes
                          </Button>
                          {/* No one's reading code reviews, right?
                          I can get away with this right? */}
                          <div className="surprise">
                            <a href="https://youtu.be/FvozpkEtLrA" target="_blank" rel="noreferrer">
                              <img src="../static/detective.png" alt="lucky you!" />
                            </a>
                          </div>
                        </Offcanvas.Body>
                      </Offcanvas>
                    </span>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 12 }}>
              <div className="my-4 p-3 box-shadowed bordered" style={{ minHeight: '110px' }}>
                <ReviewList
                  user_id={user_id}
                  reviews={reviews}
                  update={updateReviews}
                  expandReviews={expandReviews}
                  setExpandReviews={setExpandReviews}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={{ span: 1 }} />
      </Row>
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
    <div>
      <div className="d-flex flex-column" style={{ marginLeft: '2%' }}>
        <div className="mx-2">
          <p className="size-30 no-mp">{`Reviews (${data.reviews.length})`}</p>
        </div>
        <div className="mx-2 mb-1">
          {data.reviews.length > 0 && (
            <Button
              variant="warning"
              onClick={() => props.setExpandReviews(!props.expandReviews)}
              aria-controls="review-section"
              aria-expanded={props.expandReviews}
            >
              Click to view...
            </Button>
          )}
        </div>
      </div>
      <Collapse in={props.expandReviews}>
        <div id="review-section">
          <Stack gap={3}>
            {data.reviews.map((review) => (
              <Link
                key={review.pokedex_id}
                to={`/pokemon/${review.pokedex_id}`}
                className="review-title"
              >
                <div className="review">
                  <Stack direction="horizontal" gap={2}>
                    <Avatar
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${review.pokedex_id}.png`}
                      class="pokemon-avatar"
                      style={{
                        border: '2px solid lightgray',
                      }}
                    />
                    <Rating name="read-only" value={review.rating} size="small" readOnly />
                    <p className="fw-bold title">{`${review.title}`}</p>
                  </Stack>
                  <p className="review-body">{`${review.body.substring(0, 150)}${
                    review.body.length > 150 ? '...' : ''
                  }`}</p>
                </div>
              </Link>
            ))}
          </Stack>
        </div>
      </Collapse>
    </div>
  );
};

ReviewList.propTypes = {
  user_id: propTypes.string,
  reviews: propTypes.string,
  update: propTypes.func,
  expandReviews: propTypes.bool,
  setExpandReviews: propTypes.func,
};

export default Profile;
