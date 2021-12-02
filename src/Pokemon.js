/* eslint-disable prefer-const */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Stack,
  Collapse,
  Modal,
  OverlayTrigger,
  Popover,
  Nav,
} from 'react-bootstrap/';
import './Pokemon.css';
import { Rating, Avatar } from '@mui/material/';
import { Link, useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import {
  getPokemon,
  getPokemonFlavorText,
  getAbilityFlavorText,
  getEvolutionChainLink,
  getEvolutionChain,
} from './Frontend';
import { getPokemonReviews, getUserReview, addReview, editReview, deleteReview } from './Backend';
import { getPokemonTypes, getPokemonAbilities, getPokemonStats } from './PokemonInfo';

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
  const [PokemonTexts, setPokemonTexts] = useState('');
  const [AbilityTexts, setAbilityTexts] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [TopButtonValidated, setTopButtonValidated] = useState(false);
  const [EvolutionInfo, setEvolutionInfo] = useState([]);

  function calcAverage(reviews) {
    const ratings = [];
    reviews.forEach((review) => {
      ratings.push(review.rating);
    });
    const average = ratings.reduce((total, current) => total + current) / ratings.length;
    setAverageRating(average);
  }

  useEffect(() => {
    getPokemon(id).then((data) => {
      setPokemonInfo({
        name: data.name,
        pic: data.sprites.other['official-artwork'].front_default,
      });
      setPokemonTypes(getPokemonTypes(data.types));
      setPokemonAbilities(getPokemonAbilities(data.abilities));
      setPokemonStats(getPokemonStats(data.stats));
    });

    getPokemonFlavorText(id).then((data) => {
      // eslint-disable-next-line prefer-const
      let texts = [];
      data.flavor_text_entries.forEach((entry) => {
        if (entry.language.name === 'en') {
          texts.push(entry.flavor_text);
        }
      });
      setPokemonTexts(texts[Math.floor(Math.random() * texts.length)]);
    });
  }, []);

  useEffect(() => {
    PokemonAbilities.forEach((ability) => {
      getAbilityFlavorText(ability).then((data) => {
        for (let i = 0; i < data.flavor_text_entries.length; i += 1) {
          if (data.flavor_text_entries[i].language.name === 'en') {
            setAbilityTexts((prevAbilityTexts) => [
              ...prevAbilityTexts,
              { name: ability, text: data.flavor_text_entries[i].flavor_text },
            ]);
            break;
          }
        }
      });
    });
  }, [PokemonAbilities]);

  useEffect(() => {
    getEvolutionChainLink(id).then((data) => {
      getEvolutionChain(data.evolution_chain.url).then((data2) => {
        if (data2.chain.evolves_to.length > 0) {
          getPokemon(data2.chain.species.name).then((data3) => {
            setEvolutionInfo((prevEvolutionInfo) => [
              ...prevEvolutionInfo,
              {
                name: data3.name,
                pic: data3.sprites.other['official-artwork'].front_default,
                id: data3.id,
              },
            ]);
          });
          for (let i = 0; i < data2.chain.evolves_to.length; i += 1) {
            getPokemon(data2.chain.evolves_to[i].species.name).then((data4) => {
              setEvolutionInfo((prevEvolutionInfo) => [
                ...prevEvolutionInfo,
                {
                  name: data4.name,
                  pic: data4.sprites.other['official-artwork'].front_default,
                  id: data4.id,
                },
              ]);
            });
            if (data2.chain.evolves_to[i].evolves_to.length > 0) {
              getPokemon(data2.chain.evolves_to[i].evolves_to[i].species.name).then((data5) => {
                setEvolutionInfo((prevEvolutionInfo) => [
                  ...prevEvolutionInfo,
                  {
                    name: data5.name,
                    pic: data5.sprites.other['official-artwork'].front_default,
                    id: data5.id,
                  },
                ]);
              });
            }
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    const promise = getPokemonReviews(id);
    promise.then((data) => {
      if (data === null) {
        setTotalReview(data);
      } else {
        setTotalReview(data.reviews.sort((a, b) => new Date(b.time) - new Date(a.time)));
        calcAverage(data.reviews);
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

  return (
    <Container className="mt-2">
      <Row className="box-shadowed-title mb-4 mt-4 p-3" id="1">
        <PokemonDisplay
          PokemonInfo={PokemonInfo}
          PokemonTypes={PokemonTypes}
          PokemonAbilities={PokemonAbilities}
          PokemonStats={PokemonStats}
          PokemonTexts={PokemonTexts}
          PokemonAverageRating={averageRating}
          AbilityTexts={AbilityTexts}
          TotalReview={TotalReview}
          id={id}
        />
      </Row>
      <Row className="box-shadowed-body">
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
              <h2 className="text-start fw-light">
                All reviews <i className="bi bi-caret-down" style={{ fontSize: '20px' }} />
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
        <Col md={{ span: 4, offset: 1 }} className="text-center">
          <div>
            <h2 className="fw-light mb-4">Evolutions</h2>
            <Stack gap={3}>
              {EvolutionInfo.map((evoinfo) => (
                <div>
                  <a
                    href={evoinfo.id !== id ? `/pokemon/${evoinfo.id}` : '#1'}
                    style={{ display: 'inline-block' }}
                  >
                    <img
                      style={{ backgroundColor: 'gainsboro' }}
                      className="evoresult"
                      src={evoinfo.pic}
                      width={150}
                      height={150}
                      alt={evoinfo.name}
                    />
                  </a>
                  <p className="text-capitalize">{evoinfo.name}</p>
                </div>
              ))}
            </Stack>
          </div>
        </Col>
      </Row>
      {TopButtonValidated && (
        <Button onClick={scrollToTop} className="top-button">
          <i className="bi bi-arrow-up" />
        </Button>
      )}
    </Container>
  );
};

Pokemon.propTypes = {
  userdata: propTypes.object,
};

const PokemonDisplay = function PokemonDisplay(props) {
  const {
    PokemonInfo,
    PokemonTypes,
    PokemonStats,
    PokemonTexts,
    PokemonAverageRating,
    AbilityTexts,
    TotalReview,
    id,
  } = props;
  function PokemonId() {
    const str = `${id}`;
    const pad = '000';
    const result = pad.substring(0, pad.length - str.length) + str;
    return result;
  }

  return (
    <>
      <Row>
        {id > 1 && id < 898 ? (
          <>
            <Col md={{ span: 2 }}>
              <div className="box-shadowed-left" style={{ width: '50%' }}>
                <Nav.Link
                  href={`/pokemon/${id - 1}`}
                  style={{ color: 'black' }}
                  className="fw-light"
                >
                  <i className="bi bi-chevron-compact-left" /> #
                  {`${'000'.substring(0, '000'.length - `${id - 1}`.length)}${id - 1}`}
                </Nav.Link>
              </div>
            </Col>
            <Col md={{ span: 4, offset: 2 }}>
              <div className="d-flex justify-content-center" style={{ marginLeft: '22%' }}>
                <h1 className="text-capitalize me-3">{PokemonInfo.name}</h1>
                <h1 className="fw-lighter">
                  #<PokemonId />
                </h1>
              </div>
            </Col>
            <Col md={{ span: 3, offset: 1 }}>
              <div className="box-shadowed-right ms-auto text-end" style={{ width: '35%' }}>
                <Nav.Link
                  href={`/pokemon/${parseInt(id, 10) + 1}`}
                  style={{ color: 'black' }}
                  className="fw-light"
                >
                  #
                  {`${'000'.substring(0, '000'.length - `${parseInt(id, 10) + 1}`.length)}${
                    parseInt(id, 10) + 1
                  }`}{' '}
                  <i className="bi bi-chevron-compact-right" />
                </Nav.Link>
              </div>
            </Col>
          </>
        ) : (
          <>
            {id === '1' && (
              <>
                <Col md={{ span: 4, offset: 4 }}>
                  <div className="d-flex justify-content-center" style={{ marginLeft: '22%' }}>
                    <h1 className="text-capitalize me-3">{PokemonInfo.name}</h1>
                    <h1 className="fw-lighter">
                      #<PokemonId />
                    </h1>
                  </div>
                </Col>
                <Col md={{ span: 3, offset: 1 }}>
                  <div className="box-shadowed-right ms-auto text-end" style={{ width: '35%' }}>
                    <Nav.Link
                      href={`/pokemon/${parseInt(id, 10) + 1}`}
                      style={{ color: 'black' }}
                      className="fw-light"
                    >
                      #
                      {`${'000'.substring(0, '000'.length - `${parseInt(id, 10) + 1}`.length)}${
                        parseInt(id, 10) + 1
                      }`}{' '}
                      <i className="bi bi-chevron-compact-right" />
                    </Nav.Link>
                  </div>
                </Col>
              </>
            )}
            {id === '898' && (
              <>
                <Col md={{ span: 2 }}>
                  <div className="box-shadowed-left" style={{ width: '50%' }}>
                    <Nav.Link
                      href={`/pokemon/${id - 1}`}
                      style={{ color: 'black' }}
                      className="fw-light"
                    >
                      <i className="bi bi-chevron-compact-left" /> #
                      {`${'000'.substring(0, '000'.length - `${id - 1}`.length)}${id - 1}`}
                    </Nav.Link>
                  </div>
                </Col>
                <Col md={{ span: 4, offset: 2 }}>
                  <div className="d-flex justify-content-center" style={{ marginLeft: '22%' }}>
                    <h1 className="text-capitalize me-3">{PokemonInfo.name}</h1>
                    <h1 className="fw-lighter">
                      #<PokemonId />
                    </h1>
                  </div>
                </Col>
              </>
            )}
          </>
        )}
      </Row>

      <Row>
        <Col md={{ span: 4, offset: 1 }}>
          <div>
            <h3 className="fw-light">Average Ratings</h3>
            <Stack direction="horizontal" gap={2}>
              <p className="fs-1">{PokemonAverageRating.toPrecision(2)}</p>
              <Stack className="mt-1">
                <Rating
                  name="read-only"
                  value={PokemonAverageRating.toPrecision(2)}
                  size="large"
                  precision={0.1}
                  readOnly
                />
                {TotalReview === null ? (
                  <p className="fs-6 fw-light ms-2">0 review</p>
                ) : (
                  <p className="fs-6 fw-light ms-2">{TotalReview.length} review(s)</p>
                )}
              </Stack>
            </Stack>
          </div>
          <div>
            <h3 className="fw-light">Stats</h3>
            <ul className="text-center">
              <Stack direction="horizontal" gap={3}>
                {PokemonStats.map((stat) => (
                  <li key={stat.name}>
                    <Stack>
                      <div className="progress progress-bar-vertical mx-auto">
                        <div
                          style={{ height: stat.valueovermax, width: '100%', position: 'relative' }}
                        >
                          <div className="progress-bar" style={{ height: stat.valueovermax }}>
                            {stat.value}
                          </div>
                        </div>
                      </div>
                      <div className="text-capitalize fw-bold" style={{ fontSize: '10px' }}>
                        {stat.name.replace('-', ' ')}
                      </div>
                    </Stack>
                  </li>
                ))}
              </Stack>
            </ul>
          </div>
        </Col>
        <Col md={{ span: 3 }} className="p-0">
          <div>
            <img
              style={{ backgroundColor: 'gainsboro' }}
              src={PokemonInfo.pic}
              width={300}
              height={300}
              alt={PokemonInfo.name}
            />
          </div>
        </Col>
        <Col md={{ span: 4 }}>
          <p>{PokemonTexts}</p>
          <div>
            <h3 className="fw-light">Type</h3>
            <ul>
              {PokemonTypes.map((type) => (
                <li key={type} className={`type-icon type-${type} me-3`}>
                  {type}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="fw-light">Abilities</h3>
            <ul>
              {AbilityTexts.map((ability) => (
                <li key={ability.name} style={{ textTransform: 'capitalize' }}>
                  {`${ability.name.replace('-', ' ')}`}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Header>{ability.text}</Popover.Header>
                      </Popover>
                    }
                  >
                    <i className="bi bi-question-circle-fill ms-2" style={{ fontSize: '15px' }} />
                  </OverlayTrigger>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </>
  );
};

PokemonDisplay.propTypes = {
  PokemonInfo: propTypes.object,
  PokemonTypes: propTypes.array,
  PokemonStats: propTypes.array,
  PokemonTexts: propTypes.string,
  PokemonAverageRating: propTypes.number,
  AbilityTexts: propTypes.object,
  TotalReview: propTypes.array,
  id: propTypes.number,
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
                  <Link to={`/profile/${review.user_id}`} className="text-decoration-none">
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
          <div className="ms-auto">
            <Button
              id="cancelreview"
              variant="secondary"
              type="button"
              className="me-3"
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
