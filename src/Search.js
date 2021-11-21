/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useState, useRef, useEffect } from 'react';
import { FormControl, Button, Container, Stack } from 'react-bootstrap/';
import './Search.css';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material/';
import { getPokemon } from './Frontend';
import { getPokemonReviews } from './Backend';

const Search = function Search() {
  const NameRef = useRef();
  const [Pokemon, setPokemon] = useState({});
  const [PokemonId, setPokemonId] = useState();
  const [TotalReview, setTotalReview] = useState([]);

  function ClickToSearch(id) {
    if (id === '') {
      // eslint-disable-next-line no-alert
      alert("Can't be empty");
    } else {
      getPokemon(id)
        .then((data) => {
          setPokemon({
            name: data.name,
            pic: data.sprites.other.dream_world.front_default,
            id: data.id,
          });
        })
        .catch(() => {
          // eslint-disable-next-line no-alert
          alert("Can't find Pokemon");
        });
      NameRef.current.value = null;
    }
  }

  useEffect(() => {
    setPokemonId(Pokemon.id);
  }, [Pokemon]);

  useEffect(() => {
    if (Object.keys(Pokemon).length !== 0) {
      getPokemonReviews(String(PokemonId)).then((data) => {
        if (data === null) {
          setTotalReview(null);
        } else {
          setTotalReview(data.reviews);
        }
      });
    }
  }, [PokemonId]);

  function HandleKeyDown(e) {
    if (e.key === 'Enter') {
      document.getElementById('SearchButton').click();
    }
  }

  return (
    <Container fluid>
      <h4 className="text-center">Enter Id or Name(lowercase) :</h4>
      <div className="d-flex search">
        <FormControl
          type="search"
          ref={NameRef}
          placeholder="Enter Pokemon"
          aria-label="Search"
          onKeyDown={HandleKeyDown}
        />
        <Button
          id="SearchButton"
          variant="outline-success"
          onClick={() => ClickToSearch(NameRef.current.value)}
        >
          Search
        </Button>
      </div>
      {Object.keys(Pokemon).length !== 0 && (
        <div>
          <Result PokemonId={PokemonId} Pokemon={Pokemon} TotalReview={TotalReview} />
        </div>
      )}
    </Container>
  );
};

const Result = function Result(props) {
  const { PokemonId, Pokemon, TotalReview } = props;
  const [RatingAverage, setRatingAverage] = useState(0);
  useEffect(() => {
    if (TotalReview !== null) {
      // eslint-disable-next-line prefer-const
      let ratings = [];
      TotalReview.forEach((review) => {
        ratings.push(review.rating);
      });
      if (ratings.length !== 0) {
        // eslint-disable-next-line prefer-const
        let average = ratings.reduce((total, current) => total + current) / ratings.length;
        setRatingAverage(average);
      }
    }
  }, [TotalReview, RatingAverage]);
  return (
    <>
      <div className="frame">
        <Link to={`/pokemon/${PokemonId}`} className="link">
          <div className="result">
            <p>{Pokemon.name}</p>
            <img src={Pokemon.pic} width={100} height={100} alt={Pokemon.name} />
          </div>
        </Link>
      </div>
      <div className="text-center">
        <Stack direction="horizontal" gap={2} className="justify-content-center">
          {TotalReview === null ? (
            <div>
              <Rating key={RatingAverage} name="read-only" value={0} size="small" readOnly />
              <p className="fw-bold title">0 rating</p>
            </div>
          ) : (
            <div>
              <Rating
                key={RatingAverage}
                name="read-only"
                value={RatingAverage}
                size="small"
                readOnly
              />{' '}
              {RatingAverage.toPrecision(2)}
              <p className="fw-bold title">{TotalReview.length} ratings</p>
            </div>
          )}
        </Stack>
      </div>
    </>
  );
};

Result.propTypes = {
  PokemonId: propTypes.number,
  Pokemon: propTypes.object,
  TotalReview: propTypes.array,
};

export default Search;
