/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useState, useRef, useEffect } from 'react';
import {
  FormControl,
  Button,
  Container,
  Stack,
  Form,
  InputGroup,
  Row,
  Col,
  Spinner,
  Alert,
} from 'react-bootstrap/';
import './Search.css';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material/';
import { getPokemon, getPokemonList } from './Frontend';
import { getPokemonReviews } from './Backend';

const Search = function Search() {
  const NameRef = useRef();
  const [Pokemon, setPokemon] = useState({});
  const [TotalReview, setTotalReview] = useState([]);
  const [validated, setValidated] = useState(false);
  const [AlertValidated, setAlertValidated] = useState(false);
  const [PokemonListValidated, setPokemonListValidated] = useState(true);
  const [TopButtonValidated, setTopButtonValidated] = useState(false);

  function ClickToSearch(id) {
    if (id === '') {
      setValidated(true);
    } else {
      getPokemon(id.toLowerCase())
        .then((data) => {
          setPokemon({
            name: data.name,
            pic: data.sprites.other['official-artwork'].front_default,
            id: data.id,
          });
          NameRef.current.value = null;
          setValidated(false);
          setAlertValidated(false);
          setPokemonListValidated(false);
        })
        .catch(() => {
          setAlertValidated(true);
        });
    }
  }

  useEffect(() => {
    if (Object.keys(Pokemon).length !== 0) {
      getPokemonReviews(String(Pokemon.id)).then((data) => {
        if (data === null) {
          setTotalReview(null);
        } else {
          setTotalReview(data.reviews);
        }
      });
    }
  }, [Pokemon]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        setTopButtonValidated(true);
      } else {
        setTopButtonValidated(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handler = (event) => {
    if (event.key === 'Enter') {
      document.getElementById('SearchButton').click();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Container>
      <Row className="box-shadowed mt-4 pb-4">
        <Col md={{ span: 4, offset: 2 }}>
          <h4 className="ms-5">Id or Name</h4>
          <div>
            <Form noValidate validated={validated}>
              <Form.Group className="mx-auto" style={{ width: '80%' }}>
                <InputGroup className="mb-3" hasValidation>
                  <FormControl
                    required
                    type="search"
                    ref={NameRef}
                    placeholder="Id: 1 Name: Bulbasaur"
                    aria-label="Search"
                    onKeyPress={(e) => handler(e)}
                  />
                  <Button
                    type="button"
                    id="SearchButton"
                    variant="outline-success"
                    onClick={() => {
                      ClickToSearch(NameRef.current.value);
                    }}
                  >
                    <i className="bi bi-search" />
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    ! Please enter Id or Name.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Form>
          </div>
          {AlertValidated && (
            <Alert
              variant="danger"
              className="mx-auto"
              onClose={() => setAlertValidated(false)}
              dismissible
            >
              No Pokémon Matched Your Search!
            </Alert>
          )}
        </Col>
        <Col md={{ span: 4 }}>
          <Alert variant="success" className="mt-3 mb-0" style={{ marginRight: '100px' }}>
            Search for a Pokémon by name or using its National Pokédex number.
          </Alert>
        </Col>
      </Row>
      <Row>
        {PokemonListValidated && (
          <Row>
            <Col md={{ span: 12 }} className="text-center">
              <DisplayPokemonList />
            </Col>
          </Row>
        )}
        {Object.keys(Pokemon).length !== 0 && (
          <div>
            <Result Pokemon={Pokemon} TotalReview={TotalReview} />
          </div>
        )}
      </Row>
      {TopButtonValidated && (
        <Button onClick={scrollToTop} className="top-button">
          <i className="bi bi-arrow-up" />
        </Button>
      )}
    </Container>
  );
};

const DisplayPokemonList = function DisplayPokemonList() {
  const [PokemonList, setPokemonList] = useState([]);
  const memory = useRef([]);
  const totalandaverage = useRef([]);
  const [offset, setOffset] = useState(0);
  const [SpinnerValidated, setSpinnerValidated] = useState(false);

  let promiseList = [];
  let displayList = [];
  let reviewList = [];

  const appendObject = (object) => {
    for (let i = 0; i < object.length; i += 1) {
      for (const key in object[i]) {
        memory.current[i][key] = object[i][key];
      }
    }
    setPokemonList(memory.current);
  };

  useEffect(() => {
    promiseList.push(getPokemonList(offset));
    Promise.all(promiseList).then((data) => {
      data[0].results.forEach((value) => {
        displayList.push(getPokemon(value.name));
      });
      Promise.all(displayList).then((pokemondata) => {
        pokemondata.forEach((pokemon) => {
          setPokemonList((prevPokemonList) => [
            ...prevPokemonList,
            {
              name: pokemon.name,
              pic: pokemon.sprites.other['official-artwork'].front_default,
              id: pokemon.id,
              type: pokemon.types[0].type.name,
              totalreview: 0,
              averageval: 0,
            },
          ]);
          memory.current = [
            ...memory.current,
            {
              name: pokemon.name,
              pic: pokemon.sprites.other['official-artwork'].front_default,
              id: pokemon.id,
              type: pokemon.types[0].type.name,
              totalreview: 0,
              averageval: 0,
            },
          ];
          reviewList.push(getPokemonReviews(pokemon.id));
        });
        setSpinnerValidated(false);
        Promise.all(reviewList).then((allreview) => {
          allreview.forEach((reviewdata) => {
            let ratings = [];
            reviewdata.reviews.forEach((review) => {
              ratings.push(review.rating);
            });
            let average = ratings.reduce((total, current) => total + current) / ratings.length;
            totalandaverage.current = [
              ...totalandaverage.current,
              { totalreview: ratings.length, averageval: average },
            ];
          });
          appendObject(totalandaverage.current);
        });
      });
    });
  }, [offset]);

  useEffect(() => {
    const onScroll = function onScroll() {
      if (offset !== 0) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          setSpinnerValidated(true);
          setOffset(offset + 15);
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);

  return (
    <div>
      <div>
        <ul>
          {PokemonList.map((pokemon) => (
            <li key={pokemon.id} className="d-inline-block p-4">
              <div className="frame">
                <Link to={`/pokemon/${pokemon.id}`} className="link">
                  <div className={`result type-${pokemon.type}`}>
                    <Stack direction="horizontal" gap={2} className="justify-content-center">
                      <h5 className="text-capitalize">{pokemon.name}</h5>
                      <h5 className="fw-lighter">
                        #
                        {`${'000'.substring(0, '000'.length - `${pokemon.id}`.length)}${
                          pokemon.id
                        }`}
                      </h5>
                    </Stack>
                    <img src={pokemon.pic} width={150} height={150} alt={pokemon.name} />
                  </div>
                </Link>
              </div>
              <div className="text-center">
                <Stack direction="horizontal" gap={2} className="justify-content-center">
                  {pokemon.totalreview === null ? (
                    <div>
                      <Stack direction="horizontal" gap={2}>
                        <p className="fs-5">0.0</p>
                        <Stack className="mt-1">
                          <Rating
                            name="read-only"
                            value={0}
                            size="small"
                            precision={0.1}
                            readOnly
                          />
                          <p className="fw-light" style={{ fontSize: '15px' }}>
                            0 review
                          </p>
                        </Stack>
                      </Stack>
                    </div>
                  ) : (
                    <div>
                      <Stack direction="horizontal" gap={2}>
                        <p className="fs-5">{pokemon.averageval.toPrecision(2)}</p>
                        <Stack className="mt-1">
                          <Rating
                            name="read-only"
                            value={pokemon.averageval.toPrecision(2)}
                            size="small"
                            precision={0.1}
                            readOnly
                          />
                          <p className="fw-light" style={{ fontSize: '15px' }}>
                            {pokemon.totalreview} review(s)
                          </p>
                        </Stack>
                      </Stack>
                    </div>
                  )}
                </Stack>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {offset === 0 && (
        <Button
          id="LoadButton"
          variant="success"
          onClick={() => {
            setOffset(15);
            setSpinnerValidated(true);
          }}
        >
          Load more Pokémon
        </Button>
      )}
      {SpinnerValidated && <Spinner animation="border" variant="success" />}
    </div>
  );
};

// DisplayPokemonList.propTypes = {
//   PokemonList: propTypes.array,
//   setPokemonList: propTypes.func,
// };

const Result = function Result(props) {
  const { Pokemon, TotalReview } = props;
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
        <Link to={`/pokemon/${Pokemon.id}`} className="link">
          <div className="result">
            <Stack direction="horizontal" gap={2} className="justify-content-center">
              <h5 className="text-capitalize">{Pokemon.name}</h5>
              <h5 className="fw-lighter">
                #{`${'000'.substring(0, '000'.length - `${Pokemon.id}`.length)}${Pokemon.id}`}
              </h5>
            </Stack>
            <img src={Pokemon.pic} width={150} height={150} alt={Pokemon.name} />
          </div>
        </Link>
      </div>
      <div className="text-center">
        <Stack direction="horizontal" gap={2} className="justify-content-center">
          {TotalReview === null ? (
            <div>
              <Stack direction="horizontal" gap={2}>
                <p className="fs-5">0.0</p>
                <Stack className="mt-1">
                  <Rating name="read-only" value={0} size="small" precision={0.1} readOnly />
                  <p className="fw-light" style={{ fontSize: '15px' }}>
                    0 review
                  </p>
                </Stack>
              </Stack>
            </div>
          ) : (
            <div>
              <Stack direction="horizontal" gap={2}>
                <p className="fs-5">{RatingAverage.toPrecision(2)}</p>
                <Stack className="mt-1">
                  <Rating
                    name="read-only"
                    value={RatingAverage.toPrecision(2)}
                    size="small"
                    precision={0.1}
                    readOnly
                  />
                  <p className="fw-light" style={{ fontSize: '15px' }}>
                    {TotalReview.length} review(s)
                  </p>
                </Stack>
              </Stack>
            </div>
          )}
        </Stack>
      </div>
    </>
  );
};

Result.propTypes = {
  Pokemon: propTypes.object,
  TotalReview: propTypes.array,
};

export default Search;
