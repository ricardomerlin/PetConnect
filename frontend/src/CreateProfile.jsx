import React, { useState } from 'react';
import Login from './Login'
import App from './App'

function CreateProfile({ handleLogin }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [description, setDescription] = useState('');
    const [loggingIn, setLoggingIn] = useState(false)
    const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
    
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        if (age < 18) {
            alert('You must be at least 18 years old.');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('birthday', birthday);
        formData.append('profile_picture', profilePicture);
        formData.append('description', description);
    
        const response = await fetch('api/profiles', {
            method: 'POST',
            body: formData,
        });
    
        const data = await response.json();
    
        if (response.ok) {
            console.log('Profile saved successfully:', data);
            handleLogin(username, password);
        } else {
            console.error('Error saving profile:', data);
        }
    };

    const handleImageUpload = (e) => {
        setProfilePicture(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }

    if (loggingIn) {
        return <Login handleLogin={handleLogin}/>
    }

    return (
        <div className="create-profile-container">
            <h1>Create Profile</h1>
            <img     
            style={{
                            height: '20vh', 
                            margin: '0', 
                            borderRadius:`50%`,
                            border: '2px solid black',
                        }}  src="https://cdn.pixabay.com/photo/2017/06/19/14/11/golden-retriever-2419453_1280.jpg" alt="Golden Retriever" className="create-profile-image" />
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
                Profile Picture:
                    <input type="file" accept="image/*" onChange={handleImageUpload} required style={{display: 'none'}} id="profilePictureUpload" />
                    <br/><label htmlFor="profilePictureUpload" style={{cursor: 'pointer', textDecoration: 'underline'}}>Choose file</label>
                </label>
                {imagePreview ? 
                <img
                src={imagePreview}
                className="create-profile-upload-image"
                />
                :
                null
                }
                <label>
                    Tell us about yourself and your love for animals. What are you looking for in a pet?
                </label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{width: '50%', alignSelf: 'center'}} required />
                <div className='create-profile-button-container'>
                    <button type="submit" className="create-profile-submit">Create Profile</button>
                </div>
            </form>
            <button onClick={() => {
                console.log('Loggin in from new profile');
                setLoggingIn(true);
            }} className="create-profile-back">Back to Login</button>
        </div>
    );
}

export default CreateProfile;