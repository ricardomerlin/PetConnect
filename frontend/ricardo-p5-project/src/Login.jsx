import React, { useState, useEffect } from 'react';
import CreateProfile from './CreateProfile';

function Login({ handleLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [creatingProfile, setCreatingProfile] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin(username, password);
    };    
    
    if (creatingProfile) {
        return <CreateProfile handleLogin={handleLogin}/>;
    }
    
    // const randomInt1 = Math.floor(Math.random() * animalPics.length);
    // const randomInt2 = Math.floor(Math.random() * animalPics.length);
    // const randomInt3 = Math.floor(Math.random() * animalPics.length);
    // const randomInt4 = Math.floor(Math.random() * animalPics.length);

    return (
        <div className='login-container'>
            <div className="image-container">
                <img src="path_to_your_image1" alt="Animal" className="animal-image" />
                <img src="path_to_your_image2" alt="Animal" className="animal-image" />
            </div>
            <h1>Welcome to PetAdoptHub</h1>
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
            <div className="image-container">
                <img src="path_to_your_image3" alt="Animal" className="animal-image" />
                <img src="path_to_your_image4" alt="Animal" className="animal-image" />
            </div>
        </div>
    );
}

export default Login;