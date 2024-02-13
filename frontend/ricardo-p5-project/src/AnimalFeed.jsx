import { useEffect, useState } from "react";
import AnimalCard from "./AnimalCard";
import BreedFilter from "./BreedFilter";
import Modal from 'react-modal';
import './App.css'

Modal.setAppElement('#root')

function AnimalFeed({ profile }) {
    const [animals, setAnimals] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [filterPageCount, setFilterPageCount] = useState(1)
    const [fetchError, setFetchError] = useState(false)
    const [counter, setCounter] = useState(0)

    const [filterSubmit, setFilterSubmit] = useState(false)
    const [species, setSpecies] = useState('')

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedAnimal, setSelectedAnimal] = useState(null)
    const [imageSize, setImageSize] = useState('200px')

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);


    console.log(counter)

    console.log(pageCount)

    useEffect(() => {
        if (animals.length === 0) {
            const interval = setInterval(() => {
                setCounter(counter => counter === 10 ? 1 : counter + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [animals]);

    useEffect(() => {
        if (modalIsOpen === true) {
            document.body.classList.add('no-scroll')
        } else if (modalIsOpen === false) {
            document.body.classList.remove('no-scroll')
        }
    }, [modalIsOpen])

    function fetchAnimals(retries = 3) {
        console.log('trying to fetch animals')
        fetch(`http://127.0.0.1:5555/api/animals?page=${pageCount}`)
        .then(response => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then(data => {
            console.log(data)
            setAnimals(data.animals)
            setFetchError(false)
        })
        .catch((error) => {
            if (retries > 0) {
                setTimeout(() => fetchAnimals(retries - 1), 2000);
            } else {
                console.error('Error:', error);
                setFetchError(true)
            }
        });
    }

    function closeModal() {
        setModalIsOpen(false);
        setSelectedAnimal(null);
        setImageSize('200px');
    }

    console.log(modalIsOpen)

    useEffect(() => {
        console.log(filterSubmit)
        if (!filterSubmit) {
            return;
        }
        console.log('about to fetch')
        function fetchFilteredAnimals(retries = 3) {
            console.log('trying to fetch animals')
            fetch(`http://127.0.0.1:5555/api/animals?species=${species}&page=${filterPageCount}`)
            .then(response => {
                if (!response.ok) { 
                    console.log('response was ok')
                    throw response 
                }
                return response.json()
            })
            .then(data => {
                setAnimals(data.animals)
                setFetchError(false)
                console.log(data.type)
            })
            .catch((error) => {
                if (retries > 0) {
                    setTimeout(() => fetchFilteredAnimals(retries - 1), 2000);
                } else {
                    console.error('Error:', error);
                    setFetchError(true)
                }
            });
        }
        fetchFilteredAnimals()
    }, [filterSubmit, filterPageCount])


    useEffect(() => {
        fetchAnimals();
    }, [pageCount, fetchError]); 

    const nextPhoto = () => {
        setCurrentPhotoIndex((currentPhotoIndex + 1) % selectedAnimal.photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((currentPhotoIndex - 1 + selectedAnimal.photos.length) % selectedAnimal.photos.length);
    };

    function handleAnimalClick(animal) {
        setSelectedAnimal(animal);
        setModalIsOpen(!modalIsOpen);
    }

    function handleAdoptionConsideration(animal) {
        const animalToSave = {
            petfinder_id: animal.id,
            name: animal.name,
            species: animal.species,
            breed: animal.breeds.mixed ? (animal.breeds.secondary ? animal.breeds.primary + ', ' + animal.breeds.secondary : animal.breeds.primary) : animal.breeds.primary,
            color: animal.colors.primary || animal.colors.secondary,
            age: animal.age,
            pic: animal.photos[0] 
            ? animal.photos[0].medium 
            : animal.species.toLowerCase() === 'dog' 
                ? 'https://png.pngtree.com/png-clipart/20230308/ourmid/pngtree-cartoon-dog-sticker-cute-puppy-png-image_6629456.png' 
                : animal.species.toLowerCase() === 'cat' 
                    ? 'https://static.vecteezy.com/system/resources/previews/013/078/569/non_2x/illustration-of-cute-colored-cat-cartoon-cat-image-in-format-suitable-for-children-s-book-design-elements-introduction-of-cats-to-children-books-or-posters-about-animal-free-png.png' 
                    : 'default-image-url',
            profile_url: animal.url,
            profile_id: profile.id
        };
        console.log(animalToSave)
    
        fetch('http://127.0.0.1:5555/save_animal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(animalToSave),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    
    const handleFilterSubmit = (e) => {
        e.preventDefault()
        setFilterSubmit(true)
    }

    console.log(filterSubmit)

    return (
        <>
                <div className="App">
                <h1>Adoptable Animals</h1>
                <h2>Welcome to our loving community of animal enthusiasts! Dive into our latest array of furry friends seeking forever homes. From playful pups to graceful felines, each profile is a tale of hope and companionship waiting to be shared. Click through and discover your next loyal companion today.</h2>
                <div className="animal-feed-container">
                    <div className="filters">
                        <form onSubmit={handleFilterSubmit}>
                            <h3>Filters:</h3>
                            <select className='species-select' onChange={(e) => {
                                setSpecies(e.target.value);
                                setFilterSubmit(false);
                            }}>
                                <option value="">Select a species</option>
                                <option value="barnyard">Barnyard</option>
                                <option value="bird">Bird</option>
                                <option value="cat">Cat</option>
                                <option value="dog">Dog</option>
                                <option value="horse">Horse</option>
                                <option value="rabbit">Rabbit</option>
                            </select>
                            {(species === 'dog')
                            ?
                            <BreedFilter animals={filterSubmit ? animals : undefined}/>
                            :
                            null
                        }
                            <button>Search</button>
                        </form>
                    </div>
                    {animals.length === 0 
                    ? 
                    (
                    <div className="loading-icon">
                        <h1>{(counter%2 === 0) ? 'Loading...' : 'Loading..'}</h1>
                    </div>
                    )
                    :
                    <AnimalCard 
                        animals={animals} 
                        onAdoptionConsideration={handleAdoptionConsideration} 
                        profile={profile}
                        handleAnimalClick={handleAnimalClick}
                    />
                    }
                </div>
                <Modal
                    appElement={document.getElementById('root')}
                    isOpen={modalIsOpen}
                    contentLabel="Animal Details"
                >
                    {selectedAnimal
                    ?
                    <div className='modal-animal'>
                        <h2>{selectedAnimal.name}</h2>
                        {selectedAnimal.breeds && (
                        selectedAnimal.breeds.mixed || selectedAnimal.breeds.secondary ? (
                        <p className='animal-card-text'>
                            {selectedAnimal.breeds.primary ? <strong>{selectedAnimal.age} {selectedAnimal.gender} {selectedAnimal.breeds.primary}</strong> : `${selectedAnimal.age} ${selectedAnimal.gender}`}
                            {selectedAnimal.breeds.secondary ? <><br /><strong>Secondary Breed: {selectedAnimal.breeds.secondary}</strong></> : null}
                        </p>
                        ) : (
                            <p className='animal-card-text'><strong>{selectedAnimal.age} {selectedAnimal.gender} {selectedAnimal.breeds.primary}</strong></p>
                        ))}
                        {selectedAnimal.photos[0] ? (
                            <div className="carousel-image" style={{display: 'flex', position: 'relative'}}>
                                {(imageSize === '500px' && selectedAnimal.photos.length > 1) ?
                                    <button onClick={prevPhoto} style={{position: 'absolute', left: 0, border: '2px solid black'}}>Previous Photo</button>
                                :
                                    null
                                }
                                <img 
                                    src={selectedAnimal.photos[currentPhotoIndex]?.medium || 'default-image-url'} 
                                    alt={selectedAnimal.name} 
                                    onLoad={(e) => e.target.style.opacity = 1}
                                    style={{opacity: 0, transition: 'opacity 0.5s', width: imageSize, border: '2px solid black'}}
                                    onClick={() => {(selectedAnimal.photos[0]?.medium && imageSize === '200px') ? setImageSize('500px') : setImageSize('200px')}}
                                />
                                {(imageSize === '500px' && selectedAnimal.photos.length > 1) ?
                                    <button onClick={nextPhoto} style={{position: 'absolute', right: 0, border: '2px solid black'}}>Next Photo</button>
                                :
                                    null
                                }
                            </div>
                        ) : selectedAnimal.species.toLowerCase() === 'dog' ? (
                        <img 
                            src='https://png.pngtree.com/png-clipart/20230308/ourmid/pngtree-cartoon-dog-sticker-cute-puppy-png-image_6629456.png' 
                            alt={selectedAnimal.name} 
                            onLoad={(e) => e.target.style.opacity = 1}
                            style={{opacity: 0, transition: 'opacity 0.5s', width: imageSize, padding: '1vw'}}
                            onClick={() => {(selectedAnimal.photos[0]?.medium && imageSize === '200px') ? setImageSize('500px') : setImageSize('200px')}}
                        />
                        ) : selectedAnimal.species.toLowerCase() === 'cat' ? (
                        <img 
                            src='https://static.vecteezy.com/system/resources/previews/013/078/569/non_2x/illustration-of-cute-colored-cat-cartoon-cat-image-in-format-suitable-for-children-s-book-design-elements-introduction-of-cats-to-children-books-or-posters-about-animal-free-png.png' 
                            alt={selectedAnimal.name} 
                            onLoad={(e) => e.target.style.opacity = 1}
                            style={{opacity: 0, transition: 'opacity 0.5s', width: imageSize, objectFit: 'contain', padding: '1vw'}}
                            onClick={() => {(selectedAnimal.photos[0]?.medium && imageSize === '200px') ? setImageSize('500px') : setImageSize('200px')}}
                        />
                        ) : null}
                        <p></p> 
                        {selectedAnimal.colors.primary ? <p>Color{selectedAnimal.colors.secondary ? 's' : null}: {selectedAnimal.colors.primary}{selectedAnimal.colors.secondary ? ', ' + selectedAnimal.colors.secondary : null}</p> : null}
                        <p>Size: {selectedAnimal.size}</p>
                        {selectedAnimal.status ? <p>Status: {selectedAnimal.status}</p> : null}
                        {selectedAnimal.environment.cats || selectedAnimal.environment.dogs || selectedAnimal.environment.children ? 
                        <p className="environment-text"><strong>Environment:</strong>
                            <span className="environment-condition">{selectedAnimal.environment.cats ? "✔️ Good with cats." : "ⅹ Not good with cats."}</span>
                            <span className="environment-condition">{selectedAnimal.environment.dogs ? "✔️ Good with dogs." : "ⅹ Not good with dogs."}</span>
                            <span className="environment-condition">{selectedAnimal.environment.children ? "✔️ Good with children." : "ⅹ Not good with children."}</span>
                        </p>
                        :
                        null}
                        <h5 className='animal-card-text'>Interested in {selectedAnimal.name}? <a href={selectedAnimal.url} target="_blank" rel="noopener noreferrer">Submit an Inquiry here.</a></h5>
                        <div style={{display: 'flex'}}>
                            <h4 className='animal-card-text'>Want to save {selectedAnimal.name}'s information for later?</h4>
                            <button className='add-adopt-button' onClick={() => handleAdoptionConsideration(selectedAnimal)}>Click to add {selectedAnimal.name} <><br /> to your profile.</></button>
                        </div>
                        <button className='modal-close-button' onClick={() => {
                            console.log('I am trying to close')
                            setModalIsOpen(false)
                            setSelectedAnimal(null)
                        }}>Close {selectedAnimal.name}'s Information</button>
                    </div>
                    :
                    null}
                </Modal>
                <button onClick={() => {
                    if (filterSubmit === true) {
                        setFilterPageCount(filterPageCount === 1 ? 1 : filterPageCount - 1);
                    } else {
                        setPageCount(pageCount === 1 ? 1 : pageCount - 1);
                    }
                }}>Previous Page</button>
                <button onClick={() => {
                    if (filterSubmit === true) {
                        setFilterPageCount(filterPageCount + 1);
                    } else {
                        setPageCount(pageCount + 1);
                    }
                }}>Next Page</button>
            </div>
        </>
    )
}

export default AnimalFeed