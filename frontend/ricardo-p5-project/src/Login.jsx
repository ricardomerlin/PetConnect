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
            {/* {(animalPics.length > 0)
            ?
            <div className="image-container">
                <img src={animalPics[randomInt1]} alt="Animal" />
                <img src={animalPics[randomInt2]} alt="Animal" />
            </div>
            :
            null
            } */}
            <h1>Welcome to PetAdoptHub</h1>
            <p>We're glad to see you here. Please login to continue or create a new account if you don't have one yet.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Login</button>
            </form>
            <button onClick={() => setCreatingProfile(true)}>Create Profile</button>
            {/* {(animalPics.length > 0)
            ?
            <div className="image-container">
                <img src={animalPics[randomInt3]} alt="Animal" />
                <img src={animalPics[randomInt4]} alt="Animal" />
            </div>
            :
            null
            } */}
        </div>
    );
}

export default Login;