/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import './App.css';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap/';
import { Avatar } from '@mui/material/';
import propTypes from 'prop-types';

const NavBar = function NavBar(props) {
  const { userdata } = props;
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">◓PokeRevs◓</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/compare">Compare</Nav.Link>
            <Nav.Link href="/top">Top</Nav.Link>
          </Nav>
          <Nav className="ms-3">
            <Avatar
              alt={`${userdata.name}`}
              src={`${userdata.img}`}
              sx={{ width: 30, height: 30 }}
              className="mt-1"
            />
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{ backgroundColor: 'transparent', border: 'none' }}
              >
                {userdata.name}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ backgroundColor: '#73a47', right: '-40px', left: 'auto' }}>
                <Dropdown.Item href={`/profile/${userdata.user_id}`}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/logout">Sign out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
