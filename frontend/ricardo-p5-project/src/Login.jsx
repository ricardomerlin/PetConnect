import React, { useState } from 'react';
import CreateProfile from './CreateProfile';

function Login({ handleLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [creatingProfile, setCreatingProfile] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin(username, password);
        console.log(username)
        console.log(password)
    };

    if (creatingProfile) {
        return <CreateProfile handleLogin={handleLogin}/>;
    }

    return (
        <div>
            <h1>Login</h1>
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
        </div>
    );
}

export default Login;