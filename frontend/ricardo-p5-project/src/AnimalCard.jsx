import Modal from 'react-modal'
import { useState, useEffect } from 'react'
import './App.css'

Modal.setAppElement('#root')

function AnimalCard({ animals, handleAnimalClick, profile }) {

    function mapTags(animal) {
        return (
            <div className="tags">
                {animal.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
        );
    }
    
    console.log(profile.id)

    const mappedAnimals = Array.isArray(animals) ? animals.map(animal => {
        return (
            <div key={animal.id} className='animal-card' onClick={() => handleAnimalClick(animal)}>
            <span>
                <div className='left-card'>
                    {animal.name ? <p className='animal-card-text'><strong>{animal.name}</strong></p> : null}
                    {animal.photos[0] ? (
                    <img 
                        src={animal.photos[0]?.medium || 'default-image-url'} 
                        alt={animal.name} 
                        onLoad={(e) => e.target.style.opacity = 1}
                        style={{opacity: 0, transition: 'opacity 0.5s', width: '10vw', padding: '1vw'}}
                    /> 
                    ) : animal.species.toLowerCase() === 'dog' ? (
                    <img 
                        src='https://png.pngtree.com/png-clipart/20230308/ourmid/pngtree-cartoon-dog-sticker-cute-puppy-png-image_6629456.png' 
                        alt={animal.name} 
                        onLoad={(e) => e.target.style.opacity = 1}
                        style={{opacity: 0, transition: 'opacity 0.5s', width: '10vw', objectFit: 'contain', padding: '1vw'}}
                    />
                    ) : animal.species.toLowerCase() === 'cat' ? (
                    <img 
                        src='https://static.vecteezy.com/system/resources/previews/013/078/569/non_2x/illustration-of-cute-colored-cat-cartoon-cat-image-in-format-suitable-for-children-s-book-design-elements-introduction-of-cats-to-children-books-or-posters-about-animal-free-png.png' 
                        alt={animal.name} 
                        onLoad={(e) => e.target.style.opacity = 1}
                        style={{opacity: 0, transition: 'opacity 0.5s', width: '10vw', objectFit: 'contain', padding: '1vw'}}
                    />
                    ) : null}   
                {animal.species ? <p className='animal-card-text'>{animal.gender ? animal.gender + ' ': null}{animal.species}{animal.contact.address.city && animal.contact.address.state ? ' in ' + animal.contact.address.city + ', ' + animal.contact.address.state : null}</p> : null}
                {animal.age ? <p className='animal-card-text'>{animal.age}</p> : ''}
                </div>
                <div className='right-card'>
                    {animal.breeds && (
                        animal.breeds.mixed || animal.breeds.secondary ? (
                            <p className='animal-card-text'>
                                {animal.breeds.primary ? `Breed: ${animal.breeds.primary}` : null}
                                {animal.breeds.secondary ? <><br/>Secondary Breed: {animal.breeds.secondary}</> : null}
                            </p>
                        ) : (
                            <p className='animal-card-text'>Breed: {animal.breeds.primary}</p>
                            ))}
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className="attributes" style={{}}>
                            <>
                            {(animal.species.toLowerCase() === 'cat') ? <p className='animal-card-text'>{animal.attributes.declawed ? 'Declawed: Yes' : 'Declawed: No'}</p> : null}
                            <p className='animal-card-text'>{animal.attributes.house_trained ? 'House trained: Yes' : 'House trained: No'}</p>
                            <p className='animal-card-text'>{animal.attributes.shots_current ? 'Up to date on shots: Yes' : 'Up to date on shots: No'}</p>
                            {animal.attributes.spayed_neutered ? <p className='animal-card-text'>{(animal.gender.toLowerCase() === 'male') ? 'Neutered: Yes' : 'Spayed: Yes'}</p> : <p className='animal-card-text'>{(animal.gender.toLowerCase() === 'male' ? 'Neutered: No' : 'Spayed: No')}</p>}
                            </>
                            {mapTags(animal)}
                        </div>
                    </div>
                </div>
            </span>
            </div>
        );
    }) : [];


    return (
        <div className='animal-card-container'>
            {mappedAnimals}
        </div>
    )



}

export default AnimalCard
