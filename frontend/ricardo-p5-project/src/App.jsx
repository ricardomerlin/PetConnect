import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import AnimalFeed from './AnimalFeed';
import Profile from './Profile';
import Login from './Login'
import FosterList from './FosterList';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileId, setProfileId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isTop, setIsTop] = useState(true);

    useEffect(() => {
      fetch(`api/check_session`).then((res) => {
          if (res.ok) {
              res.json().then((user) => setProfile(user));
          }
      });
    }, []);

    const handleLogin = async (username, password) => {
      const response = await fetch('/api/login', {
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
        console.log(response)
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
      console.log('logouut button clicked')
      const response = await fetch('api/logout', {
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

    console.log(profileId)
    console.log(profile)

    useEffect(() => {
      if (profileId) { 
        console.log('I am running')
        fetch(`api/profiles/${profileId}`)
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
      {profile ?
      <div className="App">
        {!isTop &&
          <div className='pop-up-bar'>
            <div className='side-links' style={{opacity: isTop ? 0 : 1}}>
              <h2>PetConnect</h2>
              <Link className='side-link' to="/">Adoptable Animals</Link>
              <Link className='side-link' to="/profile">My Profile</Link>
              <Link className='side-link' to="/foster">Foster</Link>
            </div>
          </div>
        }
        <nav className='top-bar' style={{opacity: isTop ? 1 : 0}}>
          <div>
            {isTop ?
            <div className='links'>
              <Link className='link' style={{opacity: isTop ? 1 : 0, marginLeft: '10px'}} to="/">Adoptable Animals</Link>
              <Link className='link' style={{opacity: isTop ? 1 : 0}} to="/profile">My Profile</Link>
              <Link className='link' style={{opacity: isTop ? 1 : 0}} to="/foster">Foster</Link>
            </div>
            :
            null
            }
          </div>
          <h1>PetConnect</h1>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>
            <div className='logout'>
              <p>Welcome, {profile.name}!</p>
              <img className='small-profile-pic' src={profile.profile_picture}/>
              {isTop ? <button onClick={handleLogout}>Logout</button> : null}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<AnimalFeed profile={profile}/>} />
          <Route path="/profile" element={<Profile profile={profile}/>} />
          <Route path="/foster" element={<FosterList profile={profile}/>} />
        </Routes>
      </div>
      :
      <Routes>
        <Route path='/' element={<Login handleLogin={handleLogin}/>}></Route>
        <Route path="/profile" element={<Login handleLogin={handleLogin}/>} />
        <Route path="/foster" element={<Login handleLogin={handleLogin}/>} />
      </Routes>
      }
    </Router>
  )
}

export default App;