import Modal from 'react-modal'
import { useState } from 'react'
import './App.css'

function AnimalCard({ animals, onAdoptionConsideration, profile }) {

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedAnimal, setSelectedAnimal] = useState(null)


    function mapTags(animal) {
        return (
            <div className="tags">
                {animal.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
        );
    }

    function handleAnimalClick(animal) {
        console.log(animal)
        setSelectedAnimal(animal);
        setModalIsOpen(!modalIsOpen);
    }


    
    console.log(profile.id)

    const mappedAnimals = Array.isArray(animals) ? animals.map(animal => {
        return (
            <div key={animal.id} className='animal-card' onClick={() => handleAnimalClick(animal)}>
                {animal.name ? <h2 className='animal-card-text'><strong>{animal.name}</strong></h2> : null}
                {animal.species ? <h4 className='animal-card-text'>{animal.gender ? animal.gender + ' ': null}{animal.species}{animal.contact.address.city && animal.contact.address.state ? ' in ' + animal.contact.address.city + ', ' + animal.contact.address.state : null}</h4> : null}
                {animal.age ? <h3 className='animal-card-text'>{animal.age}</h3> : ''}
                {animal.breeds && (
                    animal.breeds.mixed || animal.breeds.secondary ? (
                        <h3 className='animal-card-text'>
                            {animal.breeds.primary ? `Primary Breed: ${animal.breeds.primary}` : null}
                            {animal.breeds.secondary ? `, Secondary Breed: ${animal.breeds.secondary}` : null}
                        </h3>
                    ) : (
                        <h3 className='animal-card-text'>Breed: {animal.breeds.primary}</h3>
                    ))}
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <span>
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
                    </span>
                    <div className="attributes" style={{padding: '1vw'}}>
                        <>
                        {(animal.species.toLowerCase() === 'cat') ? <h5 className='animal-card-text'>{animal.attributes.declawed ? 'Declawed: Yes' : 'Declawed: No'}</h5> : null}
                        <h5 className='animal-card-text'>{animal.attributes.house_trained ? 'House trained: Yes' : 'House trained: No'}</h5>
                        <h5 className='animal-card-text'>{animal.attributes.shots_current ? 'Up to date on shots: Yes' : 'Up to date on shots: No'}</h5>
                        {animal.attributes.spayed_neutered ? <h5 className='animal-card-text'>{(animal.gender.toLowerCase() === 'male') ? 'Neutered: Yes' : 'Spayed: Yes'}</h5> : <h5 className='animal-card-text'>{(animal.gender.toLowerCase() === 'male' ? 'Neutered: No' : 'Spayed: No')}</h5>}
                        </>
                    </div>
                </div>
                <div className='extra-info'>
                    {mapTags(animal)}
                    {animal.colors.primary ? <h3>Color{animal.colors.secondary ? 's' : null}: {animal.colors.primary}{animal.colors.secondary ? ', ' + animal.colors.secondary : null}</h3> : null}
                    <h3 className='animal-card-text'>Interested in {animal.name}? <a href={animal.url} target="_blank" rel="noopener noreferrer">Submit an Inquiry here.</a></h3>
                    <h4 className='animal-card-text'>Please feel free to save {animal.name}'s information for later.</h4>
                    <button onClick={() => onAdoptionConsideration(animal)}>Add to considering adoption</button>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Animal Details"
                >
                    {selectedAnimal && <h2>{selectedAnimal.name}</h2>}
                </Modal>
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
