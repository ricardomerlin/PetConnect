import { useState } from "react";


function ProfileAnimalCard({ animals, onDelete }) {

    const handleDeleteAnimal = (animal) => {
        onDelete(animal)
        fetch(`http://127.0.0.1:5555/animals/${animal.id}`, {
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
        <div key={animal.id} className="animal-card">
            {animal.pic ? 
            <img src={animal.pic} style={{width: '50%', height: '50%', objectFit: 'contain'}}
            /> : null}
            <h3>{animal.name}</h3>
            <p>{animal.species}</p>
            <button onClick={() => handleDeleteAnimal(animal)}>Remove from possible adoption list</button>
        </div>
        )))

    return (
        <div className="animal-feed-container">
            {mappedProfileAnimals()}
        </div>
    )

}

export default ProfileAnimalCard;