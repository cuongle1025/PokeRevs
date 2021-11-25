/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef } from 'react';
import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './main.css';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Main = function Main({ userdata }) {
  function randomPokemon() {
    return Math.floor(Math.random() * 850) + 1;
  }
  const randomID = useRef((Math.floor(Math.random() * 645) + 1).toString());
  const [polyA, setPolyA] = useState('static/poly1blue.svg');
  const [polyB, setPolyB] = useState('static/poly2blue.svg');
  const [back, setBack] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [color, setColor] = useState('blue');
  const timerIdRef = useRef(0);
  if (!timerStarted) {
    setTimerStarted(true);
    timerIdRef.current = setInterval(() => {
      setBack((b) => !b);
    }, 1000);
  }
  function toggleImg() {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = 0;
    } else {
      timerIdRef.current = setInterval(() => {
        setBack((b) => !b);
      }, 2000);
    }
  }

  return (
    <div>
      <Container className="oswald">
        <Row className="mt-5 pt-5 mb-2">
          <Col md={{ span: 2 }}> </Col>
          <Col md={{ span: 8 }}>
            <p className="size-50"> {`Hello, ${userdata.name}!`}</p>
            <Col md={{ span: 6 }} className="mx-4">
              <div
                className={`circle-220 pt-3 text-center ${color}`}
                onMouseEnter={() => {
                  setColor('orange');
                }}
                onMouseLeave={() => {
                  setColor('blue');
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${
                    back ? '/back/' : ''
                  }${randomID.current}.gif`}
                  alt="click me!"
                  onClick={() => toggleImg()}
                  onKeyDown={() => {}}
                  className="circle-180"
                />
              </div>
            </Col>
          </Col>
          <Col md={{ span: 2 }}> </Col>
        </Row>
        <Row>
          <Col md={{ span: 2 }}> </Col>
          <Col md={{ span: 4 }}>
            <Link
              to={`/pokemon/${randomPokemon()}`}
              className="size-40"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Button type="button" className="btn-success mx-4">
                I&apos;m Feeling Lucky
              </Button>
            </Link>
          </Col>
          <Col md={{ span: 6 }}>
            <img
              src={polyA}
              alt=""
              className="poly-right-1"
              onMouseEnter={() => {
                setPolyA('static/poly1orange.svg');
              }}
              onMouseLeave={() => {
                setPolyA('static/poly1blue.svg');
              }}
            />
            <img
              src={polyB}
              alt=""
              className="poly-right-2"
              onMouseEnter={() => {
                setPolyB('static/poly2orange.svg');
              }}
              onMouseLeave={() => {
                setPolyB('static/poly2blue.svg');
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Main.propTypes = {
  userdata: propTypes.object,
};

Main.defaultProps = {
  userdata: { name: '' },
};

export default Main;
