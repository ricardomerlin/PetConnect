import React, { useState, useEffect } from 'react';
import CreateProfile from './CreateProfile';
import DogPics from './DogPics';
import CatPics from './CatPics';

function Login({ handleLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [creatingProfile, setCreatingProfile] = useState(false);
    const [dog1, setDog1] = useState('');
    const [dog2, setDog2] = useState('');
    const [cat1, setCat1] = useState('');
    const [cat2, setCat2] = useState('');
    const [dogArray, setDogArray] = useState([]);
    const [catArray, setCatArray] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin(username, password);
    };    
    
    if (creatingProfile) {
        return <CreateProfile handleLogin={handleLogin}/>;
    }

    return (
        <div className='login-container'>
            <DogPics />
            <h1>Welcome to PetConnect</h1>
            <p>We're glad to see you here. Please login to continue or create a new account if you don't have one yet.</p>
            <form onSubmit={handleSubmit} className="login-form">
                <label className="login-label">
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="login-input" />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit" className="login-submit">Login</button>
            </form>
            <button onClick={() => setCreatingProfile(true)} className="login-create">Create Profile</button>
            <CatPics />
        </div>
    );
}

export default Login;