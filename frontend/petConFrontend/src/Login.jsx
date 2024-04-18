import React, { useState, useEffect } from 'react';
import CreateProfile from './CreateProfile';
import DogPics from './DogPics';

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

    return (
        <div className='login-container'>
            <DogPics />
            <h1 style={{marginTop: '20px', marginBottom:"0px"}}>PetConnect</h1>
            <p>We're glad to see you here. Please login to continue or create a new account if you don't have one yet.</p>
            <form onSubmit={handleSubmit} className="login-form">
                <label className="login-label">
                    Username: 
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="login-input" />
                </label>
                <label>
                    Password: 
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="login-input"/>
                </label>
                <button type="submit" className="login-submit">Login</button>
            </form>
            <button onClick={() => setCreatingProfile(true)} className="login-create">Create Profile</button>
            <div className='login-pic-container'>
                <img className='cat-pic1' src={'https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761-s1400-c100.jpg'} alt="Cat" />
            </div>
        </div>
    );
}

export default Login;