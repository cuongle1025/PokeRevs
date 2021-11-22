/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Stack } from 'react-bootstrap/';
import './Pokemon.css';
import { Rating, Avatar } from '@mui/material/';
import { Link, useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import { getPokemon } from './Frontend';
import { getPokemonReviews, getUserReview, addReview } from './Backend';

const Pokemon = function Pokemon({ userdata }) {
  const { id } = useParams();
  const [RatingValue, setRatingValue] = useState(0);
  const [PokemonInfo, setPokemonInfo] = useState({});
  const [TotalReview, setTotalReview] = useState([]);
  const [UserReview, setUserReview] = useState([]);
  const [PokemonTypes, setPokemonTypes] = useState([]);
  const [PokemonAbilities, setPokemonAbilities] = useState([]);
  const [PokemonStats, setPokemonStats] = useState([]);
  const [PokemonMoves, setPokemonMoves] = useState([]);
  const ReviewTitle = useRef();
  const ReviewBody = useRef();

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
    for (let i = 0; i < data.length; i++) {
      setPokemonTypes(PokemonTypes => [...PokemonTypes, data[i].type.name]);
    }
  }

  function getPokemonAbilities(data) {
    for (let i = 0; i < data.length; i++) {
      setPokemonAbilities(PokemonAbilities => [...PokemonAbilities, data[i].ability.name]);
    }
  }

  function getPokemonStats(data) {
    setPokemonStats(PokemonStats => [...PokemonStats, "Hp: " + (data[0].base_stat).toString()]);
    setPokemonStats(PokemonStats => [...PokemonStats, "Attack: " + (data[1].base_stat).toString()]);
    setPokemonStats(PokemonStats => [...PokemonStats, "Defense: " + (data[2].base_stat).toString()]);
    setPokemonStats(PokemonStats => [...PokemonStats, "Special Attack: " + (data[3].base_stat).toString()]);
    setPokemonStats(PokemonStats => [...PokemonStats, "Special Defense: " + (data[4].base_stat).toString()]);
    setPokemonStats(PokemonStats => [...PokemonStats, "Speed: " + (data[5].base_stat).toString()]);
  }

  function getPokemonMoves(data) {
    for (let i = 0; i < data.length; i++) {
      setPokemonMoves(PokemonMoves => [...PokemonMoves, data[i].move.name]);
    }
  }

  function ClickToReview() {
    addReview(
      userdata.user_id,
      id,
      RatingValue,
      ReviewTitle.current.value,
      ReviewBody.current.value,
    ).then((data) => {
      setUserReview(data.reviews[0]);
    });
    console.log(PokemonInfo.types)
    console.log(PokemonInfo.attributes)
    console.log(PokemonInfo.moves)
    console.log(PokemonInfo.pic)
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
        </Col>
        <Col>
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
            <details>
              <summary>
                <h2>Leave a Review</h2>
              </summary>
              <Stack direction="horizontal" gap={2}>
                <Avatar>{userdata.name.charAt(0).toUpperCase()}</Avatar>
                <Link to={`/profile/${userdata.user_id}`}>{`by ${userdata.name}`}</Link>
              </Stack>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlRating1">
                  <Form.Label>Rating:</Form.Label>
                  <Rating
                    name="rating"
                    value={RatingValue}
                    size="small"
                    onChange={(event, newValue) => {
                      setRatingValue(newValue);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Review Title:</Form.Label>
                  <Form.Control type="text" name="title" id="title" ref={ReviewTitle} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Review:</Form.Label>
                  <Form.Control as="textarea" rows={4} cols={50} ref={ReviewBody} />
                </Form.Group>
                <Button variant="primary" type="button" onClick={ClickToReview}>
                  Submit Review
                </Button>
              </Form>
            </details>
          </Col>
        ) : (
          <Col md={4}>
            <div>
              <h2 className="text-center">My review</h2>
            </div>
            <hr />
            <div>
              <Stack direction="horizontal" gap={2}>
                <Avatar>{`${UserReview.name}`.charAt(0).toUpperCase()}</Avatar>
                <Link to={`/profile/${UserReview.user_id}`}>{`by ${userdata.name}`}</Link>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                <Rating name="read-only" value={`${UserReview.rating}`} size="small" readOnly />
                <p className="fw-bold title">{UserReview.title}</p>
              </Stack>
              <p>{UserReview.body}</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

Pokemon.propTypes = {
  userdata: propTypes.object,
};

export default Pokemon;
