/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef } from 'react';
import './App.css';
import { Row, Col } from 'react-bootstrap';
import './main.css';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Main = function Main({ userdata }) {
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

  return (
    <div
      className="oswald no-mp"
      style={{
        backgroundImage: 'url(static/polygrid.svg)',
        overflow: 'hidden',
        backgroundPosition: 'center',
        backgroundRepeat: 'false',
        backgroundSize: 'cover',
      }}
    >
      <Row className="no-mp">
        <Col md={{ span: 4 }} className="">
          {' '}
        </Col>
        <Col md={{ span: 4 }} className=" no-mp">
          <div className="d-flex flex-column" id="main-section">
            <span className=" dark text-center mt-4 mb-3 px-3 py-5 box-shadow-a" id="span-1">
              <p style={{ fontSize: '5vw' }}>
                Hello,{' '}
                <span id="span-1-name" style={{ backgroundColor: 'inherit' }}>
                  {userdata.name}.
                </span>
              </p>
            </span>

            <span
              className=" dark text-center my-3 px-3 py-2 box-shadow-a"
              style={{ marginRight: '10%' }}
              id="span-2"
            >
              <Link to={`/profile/${userdata.user_id}`}>
                <p style={{ fontSize: '3vw' }}>My Reviews</p>
              </Link>
            </span>

            <span
              className=" dark text-center my-3 px-3 py-2 box-shadow-a"
              style={{ marginLeft: '15%' }}
              id="span-3"
            >
              <Link to="/compare">
                <p style={{ fontSize: '3vw' }}>Compare Pokemon</p>
              </Link>
            </span>

            <span
              className=" dark text-center my-3 px-3 py-2 box-shadow-a"
              style={{ marginLeft: '5%', marginRight: '5%' }}
              id="span-4"
            >
              <Link
                to={`/pokemon/${
                  0 + parseInt(randomID.current, 10) + Math.floor(Math.random() * 200)
                }`}
              >
                <p style={{ fontSize: '3vw' }}>I&apos;m Feeling Lucky</p>
              </Link>
            </span>
          </div>
        </Col>
        <Col md={{ span: 4 }} className="">
          {' '}
        </Col>
      </Row>
      <Row className="spacer-500" />
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
        id="polyA"
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
        id="polyB"
      />
      <span
        className={`circle-220 p-3 ${color}`}
        onMouseEnter={() => {
          setColor('orange');
        }}
        onMouseLeave={() => {
          setColor('blue');
        }}
        style={{ cursor: 'pointer', position: 'absolute', top: '70vh', right: '15vh' }}
        id="circleA"
      >
        <Link to={`/pokemon/${randomID.current}`}>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${
              back ? '/back/' : ''
            }${randomID.current}.gif`}
            alt="click me!"
            className="circle-180"
            style={{
              imageRendering: 'pixelated',
            }}
          />
        </Link>
      </span>
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
