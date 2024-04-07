import { useEffect, useState } from 'react'
import './App.css'
import ProfileAnimalCard from './ProfileAnimalCard';

function Profile({ profile }) {
    const [animals, setAnimals] = useState([]);

    console.log(profile);

    useEffect(() => {
        fetch(`api/profile/animals?profileId=${profile.id}`)
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
            <div className='profile-card'>
                <img className='profile-pic' src={profile.profile_picture} alt="Profile"/>
                <h1>{profile.name}</h1>
                <p>{profile.description}</p>
                <div>
                    <h2>Saved Animals:</h2>
                    <ProfileAnimalCard animals={animals} onDelete={handleDeletedAnimal}/>
                </div>
            </div>
        </div>
    );    
}

export default Profile;