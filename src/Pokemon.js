import React, { useState, useEffect, useRef } from 'react';
import { Form, FormControl, Button, Container, Row, Col, Stack } from 'react-bootstrap/'
import './Pokemon.css';
import { Rating, Avatar } from '@mui/material/';
import { Link, useParams } from 'react-router-dom';
import { getPokemon } from './Frontend';
import { getPokemonReviews, getUserReview, addReview } from './Backend';
import propTypes from 'prop-types';

function Pokemon({ userdata }) {
  const { id } = useParams();
  const [RatingValue, setRatingValue] = useState(0);
  const [PokemonInfo, setPokemonInfo] = useState({});
  const [TotalReview, setTotalReview] = useState([]);
  const [UserReview, setUserReview] = useState([]);
  const ReviewTitle = useRef();
  const ReviewBody = useRef();

  useEffect(() => {
    getPokemon(id).then((data) => {
      setPokemonInfo({
        name: data['name'],
        pic: data['sprites']['other']['dream_world']['front_default'],
      });
    });
  }, []);

  useEffect(() => {
    getPokemonReviews(id).then((data) => {
      if (data === null) {
        setTotalReview(data);
      } else {
        setTotalReview(data['reviews']);
      }
    });

    getUserReview(userdata['username'], id).then((data) => {
      if (data === null) {
        setUserReview(data);
      } else {
        setUserReview(data['reviews'][0]);
      }
    });
  }, [setUserReview]);

  function ClickToReview() {
    addReview(
      userdata['username'],
      id,
      RatingValue,
      ReviewTitle.current.value,
      ReviewBody.current.value,
    ).then((data) => {
      setUserReview(data['reviews'][0]);
    });
  }

  return (
    <Container fluid className="mt-2">
      <Row className="justify-content-md-center">
        <Col md={2} >
          <h2 className="text-capitalize">{PokemonInfo['name']}</h2>
          <div>
            <img src={PokemonInfo['pic']} width={150} height={150} />
          </div>
        </Col>
        {TotalReview === null ? (
          <h2 className="text-center">Pokemon doesn&apos;t have any reviews yet</h2>
        ) : (
          <Col md={6}>
            <div>
              <h2 className="text-center">Total reviews: {TotalReview.length}</h2>
            </div>
            <hr />
            <div>
              <Stack gap={3}>
                {TotalReview.map((review) => (
                  <div>
                    <Stack direction="horizontal" gap={2}>
                      <Avatar>{review.username.charAt(0).toUpperCase()}</Avatar>
                      <Link to={'/profile/' + review.username}>
                        @{review.username}
                      </Link>
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
                <Avatar>{userdata.username.charAt(0).toUpperCase()}</Avatar>
                <Link to={'/profile/' + userdata.username}>
                  @{userdata.username}
                </Link>
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
                <Avatar>{`${UserReview.username}`.charAt(0).toUpperCase()}</Avatar>
                <Link to={'/profile/' + UserReview.username}>
                  @{UserReview.username}
                </Link>
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
}

Pokemon.propTypes = {
  userdata: propTypes.object,
};

export default Pokemon;
