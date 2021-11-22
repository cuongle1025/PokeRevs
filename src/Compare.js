/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import { Button, InputGroup, FormControl, Container, Row, Col, Table } from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import { Rating, Avatar } from '@mui/material/';
import { getPokemon } from './Frontend';
import { getPokemonReviews } from './Backend';

const Compare = function Compare() {
  const inputA = useRef(null);
  const inputB = useRef(null);
  const [a, setA] = useState('Bulbasaur');
  const [b, setB] = useState('Charizard');
  const [aPic, setAPic] = useState('static/who.jpg');
  const [bPic, setBPic] = useState('static/who.jpg');
  const [isComparing, setIsComparing] = useState(false);
  const [shadowA, setShadowA] = useState('');
  const [shadowB, setShadowB] = useState('');
  const [avgA, setAvgA] = useState(1);
  const [avgB, setAvgB] = useState(1);
  const [reviewA, setReviewA] = useState({
    title: '',
    body: '',
    name: '',
    user_id: '',
    has_reviews: false,
  });
  const [reviewB, setReviewB] = useState({
    title: '',
    body: '',
    name: '',
    user_id: '',
    has_reviews: false,
  });
  const [aData, setAData] = useState({
    id: '1',
    name: 'Bulbasaur',
    abilities: [{ ability: { name: '' } }],
    moves: [{ move: { name: '' } }],
    stats: [
      { base_stat: 0, stat: { name: '' } },
      { base_stat: 0, stat: { name: '' } },
    ],
  });
  const [bData, setBData] = useState({
    id: '6',
    name: 'Charizard',
    abilities: [{ ability: { name: '' } }],
    moves: [{ move: { name: '' } }],
    stats: [
      { base_stat: 0, stat: { name: '' } },
      { base_stat: 0, stat: { name: '' } },
    ],
  });

  const colorType = (statA, statB) => {
    if (statA > statB) {
      return { color: '#008B8B' };
    }
    if (statA < statB) {
      return { color: '#8B0000' };
    }
    return { color: 'inherit' };
  };

  const submit = () => {
    const aVerified = inputA.current.value !== '' ? inputA.current.value : 'Bulbasaur';
    const bVerified = inputB.current.value !== '' ? inputB.current.value : 'Charizard';
    setA(aVerified);
    setB(bVerified);
    getPokemon(aVerified.toLowerCase())
      .then((data) => {
        setAData({
          name: data.name,
          id: data.id,
          abilities: data.abilities,
          moves: data.moves,
          height: data.height,
          weight: data.weight,
          sprites: data.sprites,
          stats: data.stats,
        });
        setAPic(data.sprites.other.dream_world.front_default);
        getPokemonReviews(data.id).then((reviewData) => {
          if (reviewData === null) {
            setAvgA(0);
          } else {
            // eslint-disable-next-line prefer-const
            let avg = [];
            // eslint-disable-next-line prefer-const
            let aReviews = [];
            reviewData.reviews.forEach((review) => avg.push(review.rating));
            reviewData.reviews.forEach((review) =>
              aReviews.push({
                title: review.title,
                body: review.body,
                name: review.name,
                user_id: review.user_id,
                has_reviews: true,
              }),
            );
            if (avg.length !== 0) {
              const average = avg.reduce((total, current) => total + current) / avg.length;
              setAvgA(average);

              const randomReview = aReviews[Math.floor(Math.random() * aReviews.length)];
              setReviewA(randomReview);
            }
          }
        });
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert(`No such Pokemon "${inputA.current.value}"`);
      });
    getPokemon(bVerified.toLowerCase())
      .then((data) => {
        setBData({
          name: data.name,
          id: data.id,
          abilities: data.abilities,
          moves: data.moves,
          height: data.height,
          weight: data.weight,
          sprites: data.sprites,
          stats: data.stats,
        });
        setBPic(data.sprites.other.dream_world.front_default);
        getPokemonReviews(data.id).then((reviewData) => {
          if (reviewData === null) {
            setAvgB(0);
          } else {
            // eslint-disable-next-line prefer-const
            let avg = [];
            // eslint-disable-next-line prefer-const
            let bReviews = [];
            reviewData.reviews.forEach((review) => avg.push(review.rating));
            reviewData.reviews.forEach((review) =>
              bReviews.push({
                title: review.title,
                body: review.body,
                name: review.name,
                user_id: review.user_id,
                has_reviews: true,
              }),
            );
            if (avg.length !== 0) {
              const average = avg.reduce((total, current) => total + current) / avg.length;
              setAvgB(average);

              const randomReview = bReviews[Math.floor(Math.random() * bReviews.length)];
              setReviewB(randomReview);
            }
          }
        });
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert(`No such Pokemon "${inputB.current.value}"`);
      });
    setIsComparing(true);
  };

  return (
    <Container>
      <div className="shadow mb-4 p-2">
        <Row className="mb-3">
          <Col md={{ span: 12 }}>
            <h3 className="text-center">Select Two Pokemon.</h3>
          </Col>
        </Row>
        <Row>
          <InputGroup className="mb-3 justify-content-center">
            <Col md={{ span: 4 }}>
              <InputGroup.Text id="p-a">Pokemon A</InputGroup.Text>
              <FormControl
                name="pokemonA"
                placeholder="Bulbasaur"
                aria-describedby="p-a"
                ref={inputA}
              />
            </Col>
            <Col md={{ span: 4 }}>
              <InputGroup.Text id="p-a">Pokemon B</InputGroup.Text>
              <FormControl
                name="pokemonB"
                placeholder="Charizard"
                aria-describedby="p-a"
                ref={inputB}
              />
            </Col>
          </InputGroup>
        </Row>
        <Row className="mb-3 justify-content-center">
          <Col md={{ span: 3 }} className="d-grid">
            <Button onClick={submit}>Compare</Button>
          </Col>
        </Row>
      </div>
      <div className="shadow mb-4 p-2">
        <Row className="mb-3">
          <Col md={{ span: 12 }}>
            <p className="text-center">{`Comparing ${a} to ${b}`}</p>
          </Col>
        </Row>
        <Row className="mb-3 justify-content-center">
          <Col
            md={{ span: 4 }}
            className={`d-grid justify-content-center ${shadowA}`}
            onMouseEnter={() => setShadowA('shadow')}
            onMouseLeave={() => setShadowA('')}
          >
            <Link to={`/pokemon/${aData.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Avatar
                alt={a}
                src={aPic}
                sx={{ width: 128, height: 128 }}
                style={{ border: '2px solid lightgray' }}
                className="shadow my-1 mx-2"
              />
              <br />
              <p className="text-center text-wrap">{aData.name}</p>
              <br />
              <Rating name="read-only" value={avgA} size="small" readOnly />
            </Link>
          </Col>
          <Col
            md={{ span: 4 }}
            className={`d-grid justify-content-center ${shadowB}`}
            onMouseEnter={() => setShadowB('shadow')}
            onMouseLeave={() => setShadowB('')}
          >
            <Link to={`/pokemon/${bData.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Avatar
                alt={b}
                src={bPic}
                sx={{ width: 128, height: 128 }}
                style={{ border: '2px solid lightgray' }}
                className="shadow my-1 mx-2"
              />
              <br />
              <p className="text-center mb-2 text-wrap">{bData.name}</p>
              <br />
              <Rating name="read-only" value={avgB} size="small" readOnly />
            </Link>
          </Col>
        </Row>
        {isComparing && (
          <div>
            <Row className="mb-3 justify-content-center">
              <Col md={{ span: 4 }}>
                {reviewA.has_reviews && (
                  <div>
                    <p className="h3">
                      <em>&quot;{reviewA.title}&quot;</em>
                    </p>
                    <p className="h4" style={{ color: 'dark-gray' }}>
                      -{' '}
                      <Link
                        to={`/profile/${reviewA.user_id}`}
                        style={{ color: 'dark-gray', textDecoration: 'none' }}
                      >
                        {reviewA.name}
                      </Link>
                    </p>
                    <p>{reviewA.body.substring(0, 50)}...</p>
                  </div>
                )}
              </Col>
              <Col md={{ span: 4 }}>
                {reviewB.has_reviews && (
                  <div>
                    <p className="h3">
                      <em>&quot;{reviewB.title}&quot;</em>
                    </p>
                    <p className="h4">
                      -{' '}
                      <Link
                        to={`/profile/${reviewB.user_id}`}
                        style={{ color: 'dark-gray', textDecoration: 'none' }}
                      >
                        {reviewB.name}
                      </Link>
                    </p>
                    <p>{reviewB.body.substring(0, 50)}...</p>
                  </div>
                )}
              </Col>
            </Row>
            <Row className="mb-3 justify-content-center">
              <Col md={{ span: 8 }}>
                <hr />
              </Col>
            </Row>
            <Row className="mb-3 justify-content-center">
              <Col md={{ span: 8 }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>{` `}</th>
                      <th>{aData.name}</th>
                      <th>{bData.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ID</td>
                      <td>{aData.id}</td>
                      <td>{bData.id}</td>
                    </tr>
                    <tr>
                      <td>Height</td>
                      <td>{aData.height}</td>
                      <td>{bData.height}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>{aData.weight}</td>
                      <td>{bData.weight}</td>
                    </tr>

                    {aData.stats.map((item, i) => (
                      <tr>
                        <td>Base {item.stat.name}</td>
                        <td
                          style={colorType(
                            item.base_stat,
                            typeof bData.stats[i] === 'undefined' ? 0 : bData.stats[i].base_stat,
                          )}
                        >
                          {item.base_stat}
                        </td>
                        <td
                          style={colorType(
                            typeof bData.stats[i] === 'undefined' ? 0 : bData.stats[i].base_stat,
                            item.base_stat,
                          )}
                        >
                          {typeof bData.stats[i] === 'undefined' ? 0 : bData.stats[i].base_stat}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td>Abilities</td>
                      <td>
                        {aData.abilities.map((item) => (
                          <span>
                            {item.ability.name}
                            <br />
                          </span>
                        ))}
                      </td>
                      <td>
                        {bData.abilities.map((item) => (
                          <span>
                            {item.ability.name}
                            <br />
                          </span>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <td>Moves</td>
                      <td>
                        <div style={{ maxHeight: '350px', overflowY: 'scroll' }}>
                          {aData.moves.map((item) => (
                            <span>
                              {item.move.name}
                              <br />
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxHeight: '350px', overflowY: 'scroll' }}>
                          {bData.moves.map((item) => (
                            <span>
                              {item.move.name}
                              <br />
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Compare;