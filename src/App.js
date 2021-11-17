import React, { useState } from 'react';
import './App.css';
import NavBar from './Nav';
import Profile from './Profile';
import Pokemon from './Pokemon';
import Search from './Search';
import Top from './Top';
import Main from './Main';
import NoMatch from './NoMatch'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const args = JSON.parse(document.getElementById('data').text);
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
          <Route path="/index" element={<Main />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </Router >
  );
}

export default App;
