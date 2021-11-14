import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Rating from '@mui/material/Rating';
import { Link, useParams } from 'react-router-dom';
import { getPokemon } from './Frontend';
import { getPokemonReviews, getUserReview, addReview } from './Backend';

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
      console.log(data);
      if (data === null) {
        setTotalReview(data);
      } else {
        setTotalReview(data['reviews']);
      }
    });

    getUserReview(userdata['username'], id).then((data) => {
      console.log(data);
      if (data === null) {
        setUserReview(data);
      } else {
        setUserReview(data['reviews'][0]);
      }
    });
  }, [setUserReview]);
  console.log(TotalReview);
  console.log(UserReview);

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
    <div>
      <h1>{PokemonInfo['name']}</h1>
      <div>
        <img src={PokemonInfo['pic']} width={150} height={150} />
      </div>
      {TotalReview === null ? (
        <h2>Pokemon doesn't have any reviews yet</h2>
      ) : (
        <div>
          <h2>Total reviews: {TotalReview.length}</h2>
          <hr />
          {TotalReview.map((review) => (
            <li key={review.username}>
              <Link to={'/profile/' + review.username}>
                {review.name} ({review.username})
              </Link>
              /<Rating name="read-only" value={review.rating} readOnly />/{review.title}/
              {review.body}
            </li>
          ))}
        </div>
      )}
      {UserReview === null ? (
        <details>
          <summary>
            <h2>Leave a Review</h2>
          </summary>
          <form>
            <label htmlFor="rating">Rating:</label>
            <div>
              <Rating
                name="rating"
                value={RatingValue}
                onChange={(event, newValue) => {
                  setRatingValue(newValue);
                }}
              />
            </div>

            <label htmlFor="title">Review Title:</label>
            <div>
              <input type="text" name="title" id="title" ref={ReviewTitle}></input>
            </div>

            <label htmlFor="review">Review:</label>
            <div>
              <textarea name="review" id="review" rows="4" cols="50" ref={ReviewBody}></textarea>
            </div>
            <button type="button" onClick={ClickToReview}>
              Submit Review
            </button>
          </form>
        </details>
      ) : (
        <div>
          <hr />
          {userdata.name}/{UserReview.username}/
          <Rating name="read-only" value={`${UserReview.rating}`} readOnly />/{UserReview.title}/
          {UserReview.body}
        </div>
      )}
    </div>
  );
}

export default Pokemon;
