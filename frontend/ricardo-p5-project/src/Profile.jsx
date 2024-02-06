import { useEffect, useState } from 'react'
import './App.css'
import ProfileAnimalCard from './ProfileAnimalCard';

function Profile({ profile }) {
    // const [profile, setProfile] = useState(null);
    const [animals, setAnimals] = useState([]);

    console.log(profile);

    useEffect(() => {
        fetch(`http://127.0.0.1:5555/profiles/${profile.id}`)
        .then(res => res.json())
        .then(data => {
            setProfile(data);
        })
        .catch(error => console.error('Error:', error));

        fetch(`http://127.0.0.1:5555/profile/animals?profileId=${profile.id}`)
        .then(res => res.json())
        .then(data => {
            setAnimals(data);
        })
        .catch(error => console.error('Error:', error));
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    function handleDeletedAnimal(deletedAnimal) {
        setAnimals(animals.filter(animal => animal.id !== deletedAnimal.id));
    }

    return (
        <div>
            <img className='profilePic' src={profile.profile_picture}/>
            <h1>{profile.name}</h1>
            <p>{profile.description}</p>
            <h2>Animals:</h2>
            <ProfileAnimalCard animals={animals} onDelete={handleDeletedAnimal}/>
        </div>
    );
}

export default Profile;