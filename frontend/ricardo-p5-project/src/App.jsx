import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import AnimalFeed from './AnimalFeed';
import Profile from './Profile';
import Login from './Login'
import FosterList from './FosterList';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(true)
  const [profileId, setProfileId] = useState(1)
  const [profile, setProfile] = useState(null)
  const [isTop, setIsTop] = useState(true);

  console.log(profileId)

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
        console.log(data.id)
        setProfileId(data.id)
    } else {
        const errorData = await response.json().catch(() => null); 
        console.log('Error:', errorData);
    }
    };

    const handleLogout = async () => {
      const response = await fetch('http://127.0.0.1:5555/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.log('Logout failed');
      }
      setLoggedIn(false);
      setProfileId(null);
      setProfile(null);
    };

    console.log(loggedIn)
    console.log(profileId)
    console.log(profile)

    useEffect(() => {
      if (profileId) { 
        console.log('I am running')
        fetch(`http://127.0.0.1:5555/profiles/${profileId}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          console.log(data)
        })
        .catch(error => console.error('Error:', error));
      }
    }, [profileId]);

    useEffect(() => {
      const checkScroll = () => {
        setIsTop(window.pageYOffset === 0);
      };
    
      window.addEventListener('scroll', checkScroll);
      return () => {
        window.removeEventListener('scroll', checkScroll);
      };
    }, []);



  return (
    <Router>
      {loggedIn && profile ?
      <div className="App">
        <nav style={{position: 'fixed', top: 0, width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'centered', width: '100%'}}>
            <Link style={{margin: '1vw', opacity: isTop ? 1 : 0.5}} to="/"><strong>Adoptable Pets</strong></Link>
            <Link style={{margin: '1vw', opacity: isTop ? 1 : 0.5}} to="/profile">Profile</Link>
            <Link style={{margin: '1vw', opacity: isTop ? 1 : 0.5}} to="/foster">Foster</Link>
          </div>
        </nav>
            <h4>Welcome, {profile.name}
              <button  style={{margin: '1vw'}} onClick={handleLogout}>Logout</button>
            </h4>
        <Routes>
          <Route path="/" element={<AnimalFeed profile={profile}/>} />
          <Route path="/profile" element={<Profile profile={profile}/>} />
          <Route path="/foster" element={<FosterList profile={profile}/>} />
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