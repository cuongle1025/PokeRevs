/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { FormControl, Button, Container, Stack } from 'react-bootstrap/';
import './Search.css';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material/';
import { getPokemon } from './Frontend';
import { getPokemonReviews } from './Backend';

function Search() {
  const NameRef = useRef();
  const [Pokemon, setPokemon] = useState({});
  const [PokemonId, setPokemonId] = useState();
  const [TotalReview, setTotalReview] = useState([]);
  const [RatingAverage, setRatingAverage] = useState();

  function ClickToSearch(id) {
    if (id === '') {
      alert("Can't be empty");
    } else {
      getPokemon(id)
        .then((data) => {
          setPokemon({
            name: data['name'],
            pic: data['sprites']['other']['dream_world']['front_default'],
            id: data['id'],
          });
        })
        .catch(() => {
          alert("Can't find Pokemon");
        });
      NameRef.current.value = null;
    }
  }

  useEffect(() => {
    setPokemonId(Pokemon['id']);
  }, [Pokemon]);

  useEffect(() => {
    if (Object.keys(Pokemon).length !== 0) {
      getPokemonReviews(String(PokemonId)).then((data) => {
        if (data === null) {
          setTotalReview(null);
        } else {
          setTotalReview(data['reviews']);
        }
      });
    }
  }, [PokemonId]);

  useEffect(() => {
    if (TotalReview !== null) {
      let ratings = [];
      TotalReview.forEach((review) => {
        ratings.push(review.rating);
      });
      if (ratings.length !== 0) {
        let average = ratings.reduce((total, current) => total + current) / ratings.length;
        setRatingAverage(average);
      }
    }
  }, [TotalReview, RatingAverage]);

  function Result() {
    return (
      <>
        <div className="frame">
          <Link to={`/pokemon/${PokemonId}`} className="link">
            <div className="result">
              <p>{Pokemon['name']}</p>
              <img src={Pokemon['pic']} width={100} height={100} alt={Pokemon['name']} />
            </div>
          </Link>
        </div>
        <div className="text-center">
          <Stack direction="horizontal" gap={2} className="justify-content-center">
            {TotalReview === null ? (
              <div>
                <Rating name="read-only" value={0} size="small" readOnly />
                <p className="fw-bold title">0 rating</p>
              </div>
            ) : (
              <div>
                <Rating name="read-only" value={RatingAverage} size="small" readOnly />
                <p className="fw-bold title">{TotalReview.length} ratings</p>
              </div>
            )}
          </Stack>
        </div>
      </>
    );
  }
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
          <Result />
        </div>
      )}
    </Container>
  );
}

export default Search;
