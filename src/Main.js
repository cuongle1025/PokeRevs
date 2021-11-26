/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef } from 'react';
import './App.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './main.css';
import propTypes from 'prop-types';

const Main = function Main({ userdata }) {
  const bg = useRef(Math.floor(Math.random() * 4) + 1);
  const randID = useRef(Math.floor(Math.random() * 850) + 1);
  const [fillA, setFillA] = useState('shape-fill');
  const [fillB, setFillB] = useState('shape-fill');
  const [fillC, setFillC] = useState('shape-fill');

  return (
    <div>
      <Container className="oswald container-fluid no-mp container-main">
        <div className="container-backdrop-dark">
          <Row className={`top-area no-mp img-${bg.current}`}>
            <Col md={{ span: 12 }} className="top-elements no-mp">
              <div className="rounded shadow p-4 m-4 top-elements easier-to-read">
                <p className="size-75 no-mp"> {`Hello, ${userdata.name}!`}</p>
                <div>
                  <Link to={`/profile/${userdata.user_id}`}>
                    <Button type="button" className="btn-info btn-lg mt-3 mx-2">
                      <span style={{ color: 'white' }}>Your Reviews</span>
                    </Button>
                  </Link>
                  <Link to={`/pokemon/${randID.current}`}>
                    <Button type="button" className="btn-success btn-lg mt-3 mx-2">
                      I&apos;m Feeling Lucky
                    </Button>
                  </Link>
                  <Link to="/compare">
                    <Button type="button" className="btn-danger btn-lg mt-3 mx-2">
                      Compare
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <div className="bottom-slant-3">
        <svg
          data-name="Layer 3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className={fillC} />
        </svg>
      </div>
      <div className="bottom-slant-2">
        <svg
          data-name="Layer 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className={fillB} />
        </svg>
      </div>
      <div className="bottom-slant">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            className={fillA}
            onMouseEnter={() => {
              setFillA('shape-fill-hover');
              setFillB('shape-fill-hover');
              setFillC('shape-fill-hover');
            }}
            onMouseLeave={() => {
              setFillA('shape-fill');
              setFillB('shape-fill');
              setFillC('shape-fill');
            }}
          />
        </svg>
      </div>
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
