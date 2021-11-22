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
import { getPokemon } from './Frontend';
import { getPokemonReviews, getUserReview, addReview, editReview, deleteReview } from './Backend';

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

  useEffect(() => {
    const promise = getPokemonReviews(id);
    promise.then((data) => {
      if (data === null) {
        setTotalReview(data);
      } else {
        setTotalReview(data.reviews);
      }
    });

    const userpromise = getUserReview(userdata.user_id, id);
    userpromise.then((data) => {
      if (data === null) {
        setUserReview(data);
      } else {
        setUserReview(data.reviews[0]);
      }
    });
  }, [setUserReview]);

  function getPokemonTypes(data) {
    for (let i = 0; i < data.length; i += 1) {
      setPokemonTypes((prevPokemonTypes) => [...prevPokemonTypes, data[i].type.name]);
    }
  }

  function getPokemonAbilities(data) {
    for (let i = 0; i < data.length; i += 1) {
      setPokemonAbilities((prevPokemonAbilities) => [
        ...prevPokemonAbilities,
        data[i].ability.name,
      ]);
    }
  }

  function getPokemonStats(data) {
    setPokemonStats((prevPokemonStats) => [
      ...prevPokemonStats,
      `Hp: ${data[0].base_stat.toString()}`,
    ]);
    setPokemonStats((prevPokemonStats) => [
      ...prevPokemonStats,
      `Attack: ${data[1].base_stat.toString()}`,
    ]);
    setPokemonStats((prevPokemonStats) => [
      ...prevPokemonStats,
      `Defense: ${data[2].base_stat.toString()}`,
    ]);
    setPokemonStats((prevPokemonStats) => [
      ...prevPokemonStats,
      `Special Attack: ${data[3].base_stat.toString()}`,
    ]);
    setPokemonStats((prevPokemonStats) => [
      ...prevPokemonStats,
      `Special Defense: ${data[4].base_stat.toString()}`,
    ]);
    setPokemonStats((prevPokemonStats) => [
      ...prevPokemonStats,
      `Speed: ${data[5].base_stat.toString()}`,
    ]);
  }

  function getPokemonMoves(data) {
    for (let i = 0; i < data.length; i += 1) {
      setPokemonMoves((prevPokemonMoves) => [...prevPokemonMoves, data[i].move.name]);
    }
  }

  useEffect(() => {
    getPokemon(id).then((data) => {
      setPokemonInfo({
        name: data.name,
        pic: data.sprites.other.dream_world.front_default,
        types: getPokemonTypes(data.types),
        abilities: getPokemonAbilities(data.abilities),
        stats: getPokemonStats(data.stats),
        moves: getPokemonMoves(data.moves),
      });
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
    });
  }

  return (
    <Container fluid className="mt-2">
      <Row className="justify-content-md-center">
        <Col md={2}>
          <h2 className="text-capitalize">{PokemonInfo.name}</h2>
          <div>
            <img src={PokemonInfo.pic} width={150} height={150} alt={PokemonInfo.name} />
          </div>
          <div>
            <h2>Type: </h2>
            {PokemonTypes.map((type) => (
              // eslint-disable-next-line react/jsx-key
              <ul>
                <li>{type}</li>
              </ul>
            ))}
          </div>
          <div>
            <h2>Abilities: </h2>
            {PokemonAbilities.map((ability) => (
              // eslint-disable-next-line react/jsx-key
              <ul>
                <li>{ability}</li>
              </ul>
            ))}
          </div>
          <details>
            <summary>
              <h2>View stats</h2>
            </summary>
            {PokemonStats.map((stat) => (
              // eslint-disable-next-line react/jsx-key
              <ul>
                <li>{stat}</li>
              </ul>
            ))}
          </details>
          <details>
            <summary>
              <h2>View Moves</h2>
            </summary>
            <div>
              {PokemonMoves.map((move) => (
                // eslint-disable-next-line react/jsx-key
                <ul>
                  <li>{move}</li>
                </ul>
              ))}
            </div>
          </details>
        </Col>
        {TotalReview === null ? (
          <h2 className="text-center">Pokemon doesn&apos;t have any reviews yet</h2>
        ) : (
          <Col md={6}>
            <div>
              <h2 className="text-center">
                Total reviews:
                {TotalReview.length}
              </h2>
            </div>
            <hr />
            <div>
              <Stack gap={3}>
                {TotalReview.map((review) => (
                  // eslint-disable-next-line react/jsx-key
                  <div>
                    <Stack direction="horizontal" gap={2}>
                      <Avatar>{review.name.charAt(0).toUpperCase()}</Avatar>
                      <Link to={`/profile/${review.user_id}`}>{`by ${review.name}`}</Link>
                    </Stack>
                    <Stack direction="horizontal" gap={2}>
                      <Rating name="read-only" value={review.rating} size="small" readOnly />
                      <p className="fw-bold title">{review.title}</p>
                    </Stack>
                    <p>{review.body}</p>
                  </div>
                ))}
              </Stack>
            </div>
          </Col>
        )}
        {UserReview === null ? (
          <Col md={4}>
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
                  <Avatar>{userdata.name.charAt(0).toUpperCase()}</Avatar>
                  <Link to={`/profile/${userdata.user_id}`}>{`by ${userdata.name}`}</Link>
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
          </Col>
        ) : (
          <Col md={4}>
            <div>
              <h2 className="text-center">My review</h2>
            </div>
            <hr />
            <Edit
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
          </Col>
        )}
      </Row>
    </Container>
  );
};

Pokemon.propTypes = {
  userdata: propTypes.object,
};

const Edit = function Edit(props) {
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
      <div>
        <Stack direction="horizontal" gap={2}>
          <Avatar>{`${UserReview.name}`.charAt(0).toUpperCase()}</Avatar>
          <Link to={`/profile/${UserReview.user_id}`}>{`by ${userdata.name}`}</Link>
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
        <p>{UserReview.body}</p>
      </div>
    );
  }
  return (
    <div>
      <Stack direction="horizontal" gap={2} className="mb-3">
        <Avatar>{userdata.name.charAt(0).toUpperCase()}</Avatar>
        <Link to={`/profile/${userdata.user_id}`}>{`by ${userdata.name}`}</Link>
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

Edit.propTypes = {
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
