/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Nav';
import Profile from './Profile';
import Pokemon from './Pokemon';
import Search from './Search';
import Top from './Top';
import Main from './Main';
import Compare from './Compare';
import NoMatch from './NoMatch';

const App = function App() {
  const args = JSON.parse(
    document.getElementById('data').text !== '{{data|safe}}'
      ? document.getElementById('data').text
      : '{"user_id": "0", "name": "name", "img": "img", "bio": "bio"}',
  );
  const [userdata, setUserData] = useState(args);
  return (
    <Router>
      <div>
        <NavBar userdata={userdata} />
        <Routes>
          <Route
            path="/profile/:id"
            element={<Profile userdata={userdata} setUserData={setUserData} />}
            exact
          />
          <Route path="/pokemon/:id" element={<Pokemon userdata={args} />} />
          <Route path="/top/" element={<Top />} />
          <Route path="/search" element={<Search />} />
          <Route path="/index" element={<Main userdata={userdata} />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/" element={<Main userdata={userdata} />} exact />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
