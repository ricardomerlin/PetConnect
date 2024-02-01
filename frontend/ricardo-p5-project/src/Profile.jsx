import { useEffect, useState } from 'react'
import './App.css'

function Profile({ profileId }) {
    const [profile, setProfile] = useState(null);
    const [animals, setAnimals] = useState([]);

    console.log(profileId);

    useEffect(() => {
        fetch(`http://127.0.0.1:5555/profiles/${profileId}`)
        .then(res => res.json())
        .then(data => {
            setProfile(data);
            console.log(data);
        })
        .catch(error => console.error('Error:', error));

        // Fetch animals associated with the profile
        fetch(`http://127.0.0.1:5555/animals?profileId=${profileId}`)
        .then(res => res.json())
        .then(data => {
            setAnimals(data);
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
    }, [profileId]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <img className='profilePic' src={profile.profile_picture}/>
            <h1>{profile.name}</h1>
            <p>{profile.description}</p>
            {/* Render other profile properties as needed */}
            <h2>Animals:</h2>
            {animals.map(animal => (
                <div key={animal.id}>
                    <h3>{animal.name}</h3>
                    <p>{animal.species}</p>
                    {/* Render other animal properties as needed */}
                </div>
            ))}
        </div>
    );
}

export default Profile;