import React, { useState } from 'react';
import Login from './Login'

function CreateProfile({ handleLogin }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [description, setDescription] = useState('');
    const [loggingIn, setLoggingIn] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://127.0.0.1:5555/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                username,
                password,
                birthday,
                profile_picture: profilePicture,
                description,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Profile saved successfully:', data);
        } else {
            console.error('Error saving profile:', data);
        }
    };

    if (loggingIn) {
        return <Login handleLogin={handleLogin}/>
    }

    return (
        <div className="create-profile-container">
            <h1>Create Profile</h1>
            <form onSubmit={handleSubmit} className="create-profile-form">
                <label className="create-profile-label">
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="create-profile-input" />
                </label>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <label>
                    Birthday:
                    <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
                </label>
                <label>
                    Profile Picture URL:
                    <input type="text" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} required />
                </label>
                <label>
                    Tell us about yourself and your love for animals. What are you looking for in a companion?
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
                <button type="submit" className="create-profile-submit">Create Profile</button>
            </form>
            <button onClick={() => {
                console.log('Loggin in from new profile');
                setLoggingIn(true);
            }} className="create-profile-back">Back to Login</button>
        </div>
    );
}

export default CreateProfile;