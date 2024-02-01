import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AnimalFeed from './AnimalFeed';
import Profile from './Profile';
import Login from './Login'
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileId, setProfileId] = useState(null)


  const handleLogin = async (username, password) => {
    const response = await fetch('http://127.0.0.1:5555/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({ 
            'username': username,
            'password': password
        }),
});


  if (response.ok) {
      const data = await response.json();
      setLoggedIn(true);
      setProfileId(data.id)
  } else {
      const errorData = await response.json().catch(() => null); 
      console.log('Error:', errorData);
  }
  };

  console.log(loggedIn)
  console.log(profileId)


  return (
    <Router>
      {loggedIn ?
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={() => (
            setLoggedIn(false),
            setProfileId(null)
          )}>Logout</button>
        </nav>
        <Routes>
          <Route path="/" element={<AnimalFeed profileId={profileId}/>} />
          <Route path="/profile" element={<Profile profileId={profileId}/>} />
        </Routes>
      </div>
      :
      <Routes>
        <Route path='/' element={<Login handleLogin={handleLogin}/>}></Route>
      </Routes>
      }
    </Router>
  )
}

export default App;