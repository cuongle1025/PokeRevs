import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

function Nav(props) {
  return (
    <nav>
      <div>PokeRevs</div>
      <ul>
        <li>
          <Link to={'/profile/' + props.userdata['username']}>Profile</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/top">Top</Link>
        </li>
      </ul>
    </nav>
  );
}

Nav.propTypes = {
  userdata: propTypes.object,
};

export default Nav;
