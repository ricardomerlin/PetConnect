import { useState } from "react";


function ProfileAnimalCard({ animals, onDelete }) {

    const handleDeleteAnimal = (animal) => {
        onDelete(animal)
        fetch(`api/animals/${animal.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            onDelete(animal)
        })
        .catch(error => console.error('Error:', error));
    }
    
    
    const mappedProfileAnimals = () => (
        animals.map(animal => (
        <div key={animal.id} className="profile-animal-card">
            <h3>{animal.name}</h3>
            {animal.pic ? 
            <img src={animal.pic} style={{width: '50%', height: '50%', objectFit: 'contain'}}
            /> : null}
            <p><strong>{animal.species}</strong></p>  
            <p>{animal.breed}</p>
            <a href={animal.profile_url}>See more on {animal.name} here.</a>
            <button onClick={() => handleDeleteAnimal(animal)}>Remove from possible adoption list</button>
        </div>
        )))

    return (
        <div className="animal-profile-container">
            {mappedProfileAnimals()}
        </div>
    )

}

export default ProfileAnimalCard;