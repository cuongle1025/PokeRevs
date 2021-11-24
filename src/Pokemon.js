/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Stack, Collapse, Modal } from 'react-bootstrap/';
import './Pokemon.css';
import { Rating, Avatar } from '@mui/material/';
import { Link, useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import { getPokemon, getFlavorText } from './Frontend';
import { getPokemonReviews, getUserReview, addReview, editReview, deleteReview } from './Backend';
import {
  getPokemonTypes,
  getPokemonAbilities,
  getPokemonStats,
  getPokemonMoves,
} from './PokemonInfo';

const Pokemon = function Pokemon({ userdata }) {
  const { id } = useParams();
  const [RatingValue, setRatingValue] = useState(0);
  const [PokemonInfo, setPokemonInfo] = useState({});
  const [TotalReview, setTotalReview] = useState([]);
  const [UserReview, setUserReview] = useState([]);
  const [TempUserRating, setTempUserRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [RatingValidated, setRatingValidated] = useState(false);
  const [EditValidated, setEditValidated] = useState(false);
  const ReviewTitle = useRef();
  const ReviewBody = useRef();
  const [PokemonTypes, setPokemonTypes] = useState([]);
  const [PokemonAbilities, setPokemonAbilities] = useState([]);
  const [PokemonStats, setPokemonStats] = useState([]);
  const [PokemonMoves, setPokemonMoves] = useState([]);
  const [PokemonTexts, setPokemonTexts] = useState('');

  useEffect(() => {
    getPokemon(id).then((data) => {
      setPokemonInfo({
        name: data.name,
        pic: data.sprites.other['official-artwork'].front_default,
        types: setPokemonTypes(getPokemonTypes(data.types)),
        abilities: setPokemonAbilities(getPokemonAbilities(data.abilities)),
        stats: setPokemonStats(getPokemonStats(data.stats)),
        moves: setPokemonMoves(getPokemonMoves(data.moves)),
      });
    });
    getFlavorText(id).then((data) => {
      // eslint-disable-next-line prefer-const
      let texts = [];
      for (let i = 0; i < data.flavor_text_entries.length; i += 1) {
        if (data.flavor_text_entries[i].language.name === 'en') {
          texts.push(data.flavor_text_entries[i].flavor_text);
        }
      }
      setPokemonTexts(texts[Math.floor(Math.random() * texts.length)]);
    });
  }, []);

  useEffect(() => {
    const promise = getPokemonReviews(id);
    promise.then((data) => {
      if (data === null) {
        setTotalReview(data);
      } else {
        setTotalReview(data.reviews.sort((a, b) => new Date(b.time) - new Date(a.time)));
      }
    });
  }, [UserReview]);

  useEffect(() => {
    const userpromise = getUserReview(userdata.user_id, id);
    userpromise.then((data) => {
      if (data === null) {
        setUserReview(data);
      } else {
        setUserReview(data.reviews[0]);
      }
    });
  }, []);

  function ClickToReview() {
    if (
      (RatingValue === 0 || RatingValue === null) &&
      (ReviewTitle.current.value === '' || ReviewBody.current.value === '')
    ) {
      setValidated(true);
      setRatingValidated(true);
    } else if (RatingValue === 0 || RatingValue === null) {
      setRatingValidated(true);
    } else if (
      RatingValue !== 0 &&
      (ReviewTitle.current.value === '' || ReviewBody.current.value === '')
    ) {
      setValidated(true);
      setRatingValidated(false);
    } else {
      addReview(
        userdata.user_id,
        id,
        RatingValue,
        ReviewTitle.current.value,
        ReviewBody.current.value,
      ).then((data) => {
        setUserReview(data.reviews[0]);
      });
    }
  }

  function ClickToEdit() {
    if (
      (TempUserRating === 0 || TempUserRating === null) &&
      (ReviewTitle.current.value === '' || ReviewBody.current.value === '')
    ) {
      setValidated(true);
      setRatingValidated(true);
    } else if (TempUserRating === 0 || TempUserRating === null) {
      setRatingValidated(true);
    } else if (
      TempUserRating !== 0 &&
      (ReviewTitle.current.value === '' || ReviewBody.current.value === '')
    ) {
      setValidated(true);
      setRatingValidated(false);
    } else {
      editReview(
        userdata.user_id,
        id,
        TempUserRating,
        ReviewTitle.current.value,
        ReviewBody.current.value,
      ).then((data) => {
        setUserReview(data.reviews[0]);
        setEditValidated(false);
      });
    }
  }

  function ClickToDelete() {
    deleteReview(userdata.user_id, id).then((data) => {
      setUserReview(data);
      setRatingValue(0);
      setEditValidated(false);
      setValidated(false);
      setRatingValidated(false);
    });
  }

  return (
    <Container fluid className="mt-2">
      <Row className="justify-content-md-center shadow mb-4 p-2">
        <PokemonDisplay
          PokemonInfo={PokemonInfo}
          PokemonTypes={PokemonTypes}
          PokemonAbilities={PokemonAbilities}
          PokemonStats={PokemonStats}
          PokemonMoves={PokemonMoves}
          PokemonTexts={PokemonTexts}
        />
      </Row>
      <Row justify-content-md-start>
        {TotalReview === null ? (
          <Col md={{ span: 6, offset: 1 }}>
            <h2 className="text-center">Pokemon doesn&apos;t have any reviews yet</h2>
            <WriteReview
              open={open}
              setOpen={setOpen}
              userdata={userdata}
              validated={validated}
              RatingValue={RatingValue}
              setRatingValue={setRatingValue}
              RatingValidated={RatingValidated}
              setRatingValidated={setRatingValidated}
              ReviewTitle={ReviewTitle}
              ReviewBody={ReviewBody}
              ClickToReview={ClickToReview}
            />
          </Col>
        ) : (
          <Col md={{ span: 6, offset: 1 }}>
            <div>
              <h2 className="text-start">
                All reviews {`>`} {TotalReview.length}
              </h2>
            </div>
            <hr />
            {UserReview === null ? (
              <WriteReview
                open={open}
                setOpen={setOpen}
                userdata={userdata}
                validated={validated}
                RatingValue={RatingValue}
                setRatingValue={setRatingValue}
                RatingValidated={RatingValidated}
                setRatingValidated={setRatingValidated}
                ReviewTitle={ReviewTitle}
                ReviewBody={ReviewBody}
                ClickToReview={ClickToReview}
              />
            ) : (
              <MyReview
                EditValidated={EditValidated}
                UserReview={UserReview}
                userdata={userdata}
                setEditValidated={setEditValidated}
                setRatingValidated={setRatingValidated}
                RatingValidated={RatingValidated}
                validated={validated}
                ReviewTitle={ReviewTitle}
                ReviewBody={ReviewBody}
                ClickToEdit={ClickToEdit}
                ClickToDelete={ClickToDelete}
                TempUserRating={TempUserRating}
                setTempUserRating={setTempUserRating}
              />
            )}
            <ReviewsDisplay TotalReview={TotalReview} userdata={userdata} />
          </Col>
        )}
      </Row>
    </Container>
  );
};

Pokemon.propTypes = {
  userdata: propTypes.object,
};

const PokemonDisplay = function PokemonDisplay(props) {
  const { PokemonInfo, PokemonTypes, PokemonAbilities, PokemonStats, PokemonMoves, PokemonTexts } =
    props;
  return (
    <>
      <Col md={{ span: 5 }}>
        <h2 className="text-capitalize">{PokemonInfo.name}</h2>
        <div>
          <img src={PokemonInfo.pic} width={150} height={150} alt={PokemonInfo.name} />
        </div>
        <details>
          <summary>
            <h2>View stats</h2>
          </summary>
          <div>
            <ul>
              {PokemonStats.map((stat) => (
                // eslint-disable-next-line react/jsx-key

                <li>{stat}</li>
              ))}
            </ul>
          </div>
        </details>
        <details>
          <summary>
            <h2>View Moves</h2>
          </summary>
          <div>
            <ul>
              {PokemonMoves.map((move) => (
                // eslint-disable-next-line react/jsx-key

                <li>{move}</li>
              ))}
            </ul>
          </div>
        </details>
      </Col>
      <Col md={{ span: 5 }}>
        <p>{PokemonTexts}</p>
        <div>
          <h2>Type: </h2>
          <ul>
            {PokemonTypes.map((type) => (
              // eslint-disable-next-line react/jsx-key
              <li>{type}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Abilities: </h2>
          <ul>
            {PokemonAbilities.map((ability) => (
              // eslint-disable-next-line react/jsx-key

              <li>{ability}</li>
            ))}
          </ul>
        </div>
      </Col>
    </>
  );
};

PokemonDisplay.propTypes = {
  PokemonInfo: propTypes.object,
  PokemonTypes: propTypes.array,
  PokemonAbilities: propTypes.array,
  PokemonStats: propTypes.array,
  PokemonMoves: propTypes.array,
  PokemonTexts: propTypes.string,
};

const ReviewsDisplay = function ReviewsDisplay(props) {
  const { TotalReview, userdata } = props;
  return (
    <div>
      <Stack gap={3}>
        {TotalReview.map((review) => {
          if (`${review.user_id}` !== `${userdata.user_id}`) {
            return (
              <div key={review.user_id}>
                <Stack direction="horizontal" gap={2}>
                  <Link to={`/profile/${review.user_id}`}>
                    <Avatar alt={`${review.name}`} src={`${review.img}`} />
                  </Link>
                  <Link to={`/profile/${review.user_id}`} className="text-decoration-none">
                    {review.name}
                  </Link>
                </Stack>
                <Stack direction="horizontal" gap={2}>
                  <Rating name="read-only" value={review.rating} size="small" readOnly />
                  <p className="fw-bold title">{review.title}</p>
                </Stack>
                <p>{`Reviewed on ${review.time}`}</p>
                <p>{review.body}</p>
              </div>
            );
          }
          return null;
        })}
      </Stack>
    </div>
  );
};

ReviewsDisplay.propTypes = {
  TotalReview: propTypes.array,
  userdata: propTypes.object,
};

const WriteReview = function WriteReview(props) {
  const {
    open,
    setOpen,
    userdata,
    validated,
    RatingValue,
    setRatingValue,
    RatingValidated,
    setRatingValidated,
    ReviewTitle,
    ReviewBody,
    ClickToReview,
  } = props;
  return (
    <>
      <div className="text-center mb-3">
        <Button
          id="writereview"
          onClick={() => setOpen(!open)}
          aria-controls="collapse-form"
          aria-expanded={open}
          variant="outline-secondary"
        >
          Write a review
        </Button>
      </div>
      <Collapse in={open} className="mt-4">
        <div id="example-collapse-text">
          <Stack direction="horizontal" gap={2} className="mb-3">
            <Link to={`/profile/${userdata.user_id}`}>
              <Avatar alt={`${userdata.name}`} src={`${userdata.img}`} />
            </Link>
            <Link to={`/profile/${userdata.user_id}`} className="text-decoration-none">
              {userdata.name}
            </Link>
          </Stack>
          <Form noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlRating1">
              <Form.Label>Overall rating</Form.Label>
              <br />
              <Rating
                name="rating"
                value={RatingValue}
                size="small"
                onChange={(event, newValue) => {
                  setRatingValue(newValue);
                  setRatingValidated(false);
                }}
              />
              {RatingValidated && (
                <div className="rating-feedback">! Please select a star rating.</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Add a headline</Form.Label>
              <Form.Control
                required
                className="shadow-sm"
                type="text"
                name="title"
                id="title"
                ref={ReviewTitle}
                placeholder="What's most important to know?"
              />
              <Form.Control.Feedback type="invalid">
                ! Please enter your headline.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Add a written review</Form.Label>
              <Form.Control
                required
                className="shadow-sm"
                as="textarea"
                rows={4}
                cols={50}
                ref={ReviewBody}
                placeholder="What do you like or dislike? How is this pokemon in combat?"
              />
              <Form.Control.Feedback type="invalid">
                ! Please add a written review.
              </Form.Control.Feedback>
            </Form.Group>
            <div className="text-end">
              <Button
                id="submitreview"
                variant="warning"
                type="button"
                onClick={ClickToReview}
                size="sm"
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Collapse>
    </>
  );
};

WriteReview.propTypes = {
  open: propTypes.bool,
  setOpen: propTypes.func,
  userdata: propTypes.object,
  validated: propTypes.bool,
  RatingValue: propTypes.number,
  setRatingValue: propTypes.func,
  RatingValidated: propTypes.bool,
  setRatingValidated: propTypes.func,
  ReviewTitle: propTypes.string,
  ReviewBody: propTypes.string,
  ClickToReview: propTypes.func,
};

const MyReview = function MyReview(props) {
  const {
    EditValidated,
    UserReview,
    userdata,
    setEditValidated,
    setRatingValidated,
    RatingValidated,
    validated,
    ReviewTitle,
    ReviewBody,
    ClickToEdit,
    ClickToDelete,
    TempUserRating,
    setTempUserRating,
  } = props;

  if (EditValidated === false) {
    return (
      <div className="mb-4">
        <Stack direction="horizontal" gap={2}>
          <Link to={`/profile/${userdata.user_id}`}>
            <Avatar alt={`${userdata.name}`} src={`${userdata.img}`} />
          </Link>
          <Link to={`/profile/${userdata.user_id}`} className="text-decoration-none">
            {userdata.name}
          </Link>
          <Button
            id="editreview"
            variant="light"
            type="button"
            size="sm"
            className="border border-dark"
            onClick={() => {
              setEditValidated(true);
              setTempUserRating(UserReview.rating);
            }}
          >
            <i className="bi bi-pencil-square" />
          </Button>
        </Stack>
        <Stack direction="horizontal" gap={2}>
          <Rating name="read-only" value={`${UserReview.rating}`} size="small" readOnly />
          <p className="fw-bold title">{UserReview.title}</p>
        </Stack>
        <p>{`Reviewed on ${UserReview.time}`}</p>
        <p>{UserReview.body}</p>
      </div>
    );
  }
  return (
    <div className="mb-4">
      <Stack direction="horizontal" gap={2} className="mb-3">
        <Link to={`/profile/${userdata.user_id}`}>
          <Avatar alt={`${userdata.name}`} src={`${userdata.img}`} />
        </Link>
        <Link to={`/profile/${userdata.user_id}`} className="text-decoration-none">
          {userdata.name}
        </Link>
      </Stack>
      <Form noValidate validated={validated}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlRating1">
          <Form.Label>Overall rating</Form.Label>
          <br />
          <Rating
            name="rating"
            value={TempUserRating}
            size="small"
            onChange={(event, newValue) => {
              setTempUserRating(newValue);
              setRatingValidated(false);
            }}
          />
          {RatingValidated && <div className="rating-feedback">! Please select a star rating.</div>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Add a headline</Form.Label>
          <Form.Control
            required
            className="shadow-sm"
            type="text"
            name="title"
            id="title"
            ref={ReviewTitle}
            placeholder="What's most important to know?"
            defaultValue={UserReview.title}
          />
          <Form.Control.Feedback type="invalid">
            ! Please enter your headline.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Add a written review</Form.Label>
          <Form.Control
            required
            className="shadow-sm"
            as="textarea"
            rows={4}
            cols={50}
            ref={ReviewBody}
            placeholder="What do you like or dislike? How is this pokemon in combat?"
            defaultValue={UserReview.body}
          />
          <Form.Control.Feedback type="invalid">
            ! Please add a written review.
          </Form.Control.Feedback>
        </Form.Group>
        <Stack direction="horizontal">
          <div>
            <DeleteButton ClickToDelete={ClickToDelete} />
          </div>
          <div className="ms-auto gx-2">
            <Button
              id="cancelreview"
              variant="secondary"
              type="button"
              onClick={() => setEditValidated(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              id="resubmitreview"
              variant="warning"
              type="button"
              onClick={ClickToEdit}
              size="sm"
            >
              Submit
            </Button>
          </div>
        </Stack>
      </Form>
    </div>
  );
};

MyReview.propTypes = {
  EditValidated: propTypes.bool,
  UserReview: propTypes.object,
  userdata: propTypes.object,
  setEditValidated: propTypes.func,
  TempUserRating: propTypes.number,
  setTempUserRating: propTypes.func,
  setRatingValidated: propTypes.func,
  RatingValidated: propTypes.bool,
  validated: propTypes.bool,
  ReviewTitle: propTypes.string,
  ReviewBody: propTypes.string,
  ClickToEdit: propTypes.func,
  ClickToDelete: propTypes.func,
};

const DeleteButton = function DeleteButton(props) {
  const { ClickToDelete } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDelete = () => {
    setShow(false);
    ClickToDelete();
  };
  return (
    <>
      <Button id="deletereview" variant="danger" type="button" onClick={handleShow} size="sm">
        Delete
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>Do you want to delete this review?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
DeleteButton.propTypes = {
  ClickToDelete: propTypes.func,
};
export default Pokemon;
