import React from 'react';
import './app.css';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <div>PokeRevs</div>
      <ul>
        <li>
          <Link to="/profile">Profile</Link>
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

export default Nav;
