/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import './App.css';
import { Navbar, Container, Nav } from 'react-bootstrap/';
import propTypes from 'prop-types';

const NavBar = function NavBar(props) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/">◓PokeRevs◓</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={`/profile/${props.userdata.user_id}`}>Profile</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/compare">Compare</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
          <Nav className="ms-3">
            <Navbar.Text title="SignedInAs">{`Signed in as: ${props.userdata.name}`}</Navbar.Text>
            <Nav.Link href="/logout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

NavBar.propTypes = {
  userdata: propTypes.object,
};

export default NavBar;
