import { useEffect, useState } from "react";
import AnimalCard from "./AnimalCard";
import DogBreedFilter from "./DogBreedFilter";
import CatBreedFilter from "./CatBreedFilter";
import Modal from 'react-modal';
import './App.css'

Modal.setAppElement('#root')

function AnimalFeed({ profile, animals }) {
    const [filterPageCount, setFilterPageCount] = useState(1);
    const [fetchError, setFetchError] = useState(false);
    const [counter, setCounter] = useState(0);
    const [isTop, setIsTop] = useState(true);

    const [filterAnimals, setFilterAnimals] = useState([]);
    const [filterSubmit, setFilterSubmit] = useState(false);

    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [size, setSize] = useState('');
    const [goodWithCats, setGoodWithCats] = useState(false);
    const [goodWithDogs, setGoodWithDogs] = useState(false);
    const [goodWithChildren, setGoodWithChildren] = useState(false);
    const [houseTrained, setHouseTrained] = useState(false);
    const [declawed, setDeclawed] = useState(false);
    const [spayedNeutered, setSpayedNeutered] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [imageSize, setImageSize] = useState('200px');

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const [lowerIndex, setLowerIndex] = useState(0);

    useEffect(() => {
        if (animals.length === 0) {
            const interval = setInterval(() => {
                setCounter(counter => counter === 10 ? 1 : counter + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [animals]);

    useEffect(() => {
        const checkScroll = () => {
          setIsTop(window.pageYOffset === 0);
        };
      
        window.addEventListener('scroll', checkScroll);
        return () => {
          window.removeEventListener('scroll', checkScroll);
        };
      }, []);

    useEffect(() => {
        if (modalIsOpen === true) {
            document.body.classList.add('no-scroll')
        } else if (modalIsOpen === false) {
            document.body.classList.remove('no-scroll')
        }
    }, [modalIsOpen])



    function closeModal() {
        setModalIsOpen(false);
        setSelectedAnimal(null);
        setImageSize('200px');
    }

    useEffect (() => {
        setFetchError(false)
    }, [])
    
    useEffect(() => {
        setFilterAnimals([]);
        if (!filterSubmit) {
            return;
        }
    
        let filteredAnimals = animals;
    
        // Apply species filter if selected
        if (species !== '') {
            filteredAnimals = filteredAnimals.filter(animal => animal.species.toLowerCase() === species);
        }
    
        // Apply breed filter if selected
        if (species === 'dog' || species === 'cat') {
            if (breed !== '') {
                filteredAnimals = filteredAnimals.filter(animal => animal.primary_breed === breed);
            }
        }
    
        // Set other filters
        if (age !== '') {
            filteredAnimals = filteredAnimals.filter(animal => animal.age === age);
        }
        if (size !== '') {
            filteredAnimals = filteredAnimals.filter(animal => animal.size === size);
        }
        if (goodWithCats) {
            filteredAnimals = filteredAnimals.filter(animal => animal.good_with_cats);
        }
        if (goodWithDogs) {
            filteredAnimals = filteredAnimals.filter(animal => animal.good_with_dogs);
        }
        if (goodWithChildren) {
            filteredAnimals = filteredAnimals.filter(animal => animal.good_with_children);
        }
        if (houseTrained) {
            filteredAnimals = filteredAnimals.filter(animal => animal.house_trained === '1');
        }
        if (declawed) {
            filteredAnimals = filteredAnimals.filter(animal => animal.declawed === '1');
        }
        if (spayedNeutered) {
            filteredAnimals = filteredAnimals.filter(animal => animal.spayed_neutered === '1');
        }
        if (city !== '') {
            filteredAnimals = filteredAnimals.filter(animal => animal.contact_address_city.toLowerCase() === city.toLowerCase());
        }
        if (state !== '') {
            filteredAnimals = filteredAnimals.filter(animal => animal.contact_address_state.toLowerCase() === state.toLowerCase());
        }
    
        setFilterAnimals(filteredAnimals);
    }, [filterSubmit, species, breed, age, size, goodWithCats, goodWithDogs, goodWithChildren, houseTrained, declawed, spayedNeutered, city, state]);
    


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

    console.log(lowerIndex)
    console.log(selectedAnimal)


    function handleAdoptionConsideration(animal) {
        const animalToSave = {
            petfinder_id: animal.petfinder_id,
            age: animal.age,
            declawed: animal.declawed,
            house_trained: animal.house_trained,
            shots: animal.shots,
            sex: animal.sex,
            spayed_neutered: animal.spayed_neutered,
            special_needs: animal.special_needs,
            primary_breed: animal.primary_breed,
            coat: animal.coat,
            primary_color: animal.primary_color,
            contact_address_city: animal.contact_address_city,
            contact_address_state: animal.contact_address_state,
            contact_email: animal.contact_email,
            contact_phone: animal.contact_phone,
            good_with_cats: animal.good_with_cats,
            good_with_children: animal.good_with_children,
            good_with_dogs: animal.good_with_dogs,
            name: animal.name,
            photo: animal.photo,
            size: animal.size,
            species: animal.species,
            status: animal.status,
            url: animal.url,
            profile_id: profile.id
        };
        console.log(animalToSave)
    
        fetch('/api/save_animal', {
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

    console.log(animals)
    console.log(filterAnimals)
    console.log(species)

    function handleBreedSelection(breed) {
        console.log(breed)
        setBreed(breed);
    }

    return (
        <>
                <div className="main-page">
                <h1 className="page-title">Adoptable Animals</h1>
                <h2>Welcome to our loving community of animal enthusiasts! Dive into our latest array of furry friends seeking forever homes. From playful pups to graceful felines, each profile is a tale of hope and companionship waiting to be shared. Click through and discover your next loyal companion today.</h2>
                <div className="animal-feed-container">
                    <div className="filters" style={{opacity: isTop ? 1 : 0}}>
                    <form onSubmit={handleFilterSubmit}>
                        <h2>Filter by:</h2>
                        <span><p>Species:</p>
                        <select className='species-select' onChange={(e) => {
                            setSpecies(e.target.value);
                        }}
                        value={species}
                        >
                            <option value="">Select a species</option>
                            <option value="alpaca">Alpaca</option>
                            <option value="cat">Cat</option>
                            <option value="chicken">Chicken</option>
                            <option value="chinchilla">Chinchilla</option>
                            <option value="dog">Dog</option>
                            <option value="dove">Dove</option>
                            <option value="duck">Duck</option>
                            <option value="ferret">Ferret</option>
                            <option value="finch">Finch</option>
                            <option value="gerbil">Gerbil</option>
                            <option value="goat">Goat</option>
                            <option value="guinea pig">Guinea Pig</option>
                            <option value="hamster">Hamster</option>
                            <option value="horse">Horse</option>
                            <option value="mouse">Mouse</option>
                            <option value="parakeet">Parakeet</option>
                            <option value="parrot">Parrot</option>
                            <option value="pheasant">Pheasant</option>
                            <option value="pig">Pig</option>
                            <option value="rabbit">Rabbit</option>
                            <option value="rat">Rat</option>
                            <option value="sheep">Sheep</option>
                            <option value="snake">Snake</option>
                            <option value="sugar glider">Sugar Glider</option>
                            <option value="turtle">Turtle</option>
                        </select></span>
                        {(species === 'dog')
                        ?
                        <div>
                            <p>Breed:</p>
                            <DogBreedFilter handleBreedSelection={handleBreedSelection}/>
                        </div>
                        :
                        null
                        }
                        {(species === 'cat')
                        ?
                        <div>
                            <p>Breed:</p>
                            <CatBreedFilter handleBreedSelection={handleBreedSelection}/>
                        </div>
                        :
                        null
                        }
                        <div>
                            <p>Age:</p>
                            <select className='age-select' onChange={(e) => setAge(e.target.value)}>
                                <option value="">Any</option>
                                <option value="baby">Baby</option>
                                <option value="young">Young</option>
                                <option value="adult">Adult</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>
                        <div>
                            <p>Size:</p>
                            <select className='size-select' onChange={(e) => setSize(e.target.value)}>
                                <option value="">Any</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="extra-large">Extra Large</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="good-with-cats">Good with Cats</label>
                            <input type="checkbox" id="good-with-cats" name="good-with-cats" value="good-with-cats" onChange={(e) => setGoodWithCats(e.target.checked)} />
                            <label htmlFor="good-with-dogs">Good with Dogs</label>
                            <input type="checkbox" id="good-with-dogs" name="good-with-dogs" value="good-with-dogs" onChange={(e) => setGoodWithDogs(e.target.checked)} />
                            <label htmlFor="good-with-children">Good with Children</label>
                            <input type="checkbox" id="good-with-children" name="good-with-children" value="good-with-children" onChange={(e) => setGoodWithChildren(e.target.checked)} />
                        </div>
                        <div>
                            <label htmlFor="house-trained">House Trained</label>
                            <input type="checkbox" id="house-trained" name="house-trained" value="house-trained" onChange={(e) => setHouseTrained(e.target.checked)} />
                            <label htmlFor="declawed">Declawed</label>
                            <input type="checkbox" id="declawed" name="declawed" value="declawed" onChange={(e) => setDeclawed(e.target.checked)} />
                            <label htmlFor="spayed-neutered">Spayed/Neutered</label>
                            <input type="checkbox" id="spayed-neutered" name="spayed-neutered" value="spayed-neutered" onChange={(e) => setSpayedNeutered(e.target.checked)} />
                        </div>
                        <div>
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" onChange={(e) => setCity(e.target.value)} />
                            <label htmlFor="state">State</label>
                            <input type="text" id="state" name="state" onChange={(e) => setState(e.target.value)} />
                        </div>
                        {filterSubmit ? null : <button>Search</button>}
                        {filterSubmit ?
                        <button type="button" onClick={() => {
                            setFilterSubmit(false);
                            setFilterAnimals([]);
                            setSpecies('');
                            setBreed('');
                            setLowerIndex(0);
                        }}>Clear Filters</button>
                        :
                        null}
                    </form>
                    </div>
                    {(animals.length === 0)
                    ? 
                    (
                    <div className="loading-icon">
                        <h1>{(counter%2 === 0) ? 'Loading...' : 'Loading..'}</h1>
                    </div>
                    )
                    :
                    <AnimalCard 
                        animals={filterAnimals.length > 0 ? filterAnimals : animals}
                        profile={profile}
                        handleAnimalClick={handleAnimalClick}
                        lowerIndex={lowerIndex}
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
                    <div className="modal-container">
                        <div className='modal-animal-top'>
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
                            {selectedAnimal.photo ? (
                                <div className="carousel-image" style={{display: 'flex', position: 'relative'}}>
                                    {(imageSize === '500px' && selectedAnimal.photos.length > 1) ?
                                        <button onClick={prevPhoto} style={{position: 'absolute', left: 0, border: '2px solid black'}}>Previous Photo</button>
                                    :
                                        null
                                    }
                                    <img 
                                        src={selectedAnimal.photo || 'default-image-url'} 
                                        alt={selectedAnimal.name} 
                                        onLoad={(e) => e.target.style.opacity = 1}
                                        style={{opacity: 0, transition: 'opacity 0.5s', width: imageSize, border: '2px solid black'}}
                                        onClick={() => {(selectedAnimal.photo && imageSize === '200px') ? setImageSize('500px') : setImageSize('200px')}}
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
                                onClick={() => {(selectedAnimal.photo && imageSize === '200px') ? setImageSize('500px') : setImageSize('200px')}}
                            />
                            ) : null}
                            </div>
                            {selectedAnimal.status ? <p><strong>{selectedAnimal.name} is available for adoption!</strong></p> : null}
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div className="left-card">
                                {selectedAnimal.primary_color ? <p><u><strong>Color:</strong></u> {selectedAnimal.primary_color}</p> : null}
                                <p><u><strong>Size:</strong></u> {selectedAnimal.size}</p>
                            </div>
                            <div className="right-card">
                                {(selectedAnimal.species.toLowerCase() === 'cat') ? <p><u><strong>Declawed:</strong></u>{selectedAnimal.declawed === '1' ? ' Yes' : ' No'}</p> : null}                                
                                <p><u><strong>House trained?</strong></u>{selectedAnimal.house_trained === '1' ? ' Yes' : ' No'}</p>                            
                                <p><u><strong>Up to date on shots?</strong></u>{selectedAnimal.shots === '0' ? ' Yes' : ' No'}</p>
                                <p><u><strong>{(selectedAnimal.sex.toLowerCase() === 'male') ? 'Neutered?' : 'Spayed?'}</strong></u>{selectedAnimal.spayed_neutered === '1' ? ' Yes' : ' No'}</p>
                            </div>
                        </div>
                            <p className="environment-text"><strong>Environment:</strong>
                                <span className="environment-condition">{selectedAnimal.good_with_cats ? "✔️ Good with cats." : "ⅹ Not good with cats."}</span>
                                <span className="environment-condition">{selectedAnimal.good_with_dogs ? "✔️ Good with dogs." : "ⅹ Not good with dogs."}</span>
                                <span className="environment-condition">{selectedAnimal.good_with_children ? "✔️ Good with children." : "ⅹ Not good with children."}</span>
                            </p>
                            {selectedAnimal.contact_address || selectedAnimal.contact_email || selectedAnimal.contact_phone ? 
                            <p className="contact-information"><strong>Contact Information:</strong>
                                {selectedAnimal.contact_address_city || selectedAnimal.contact_address_state ? 
                                    <span className="contact-text">
                                    <strong>Location: </strong>{selectedAnimal.contact_address_city}, {selectedAnimal.contact_address_state}                                       
                                    </span> 
                                : null}                                
                                {selectedAnimal.contact_email ? <span className="contact-text"><strong>Email:&nbsp;</strong>{selectedAnimal.contact_email}</span> : null}
                                {selectedAnimal.contact_phone ? <span className="contact-text"><strong>Phone:</strong> {selectedAnimal.contact_phone}</span> : null}
                            </p>
                            :
                            null}
                        <h5 className='animal-card-text'>Interested in {selectedAnimal.name}? <a href={selectedAnimal.url} target="_blank" rel="noopener noreferrer">Submit an Inquiry here.</a></h5>
                        <h4 className='animal-card-text'>Want to save {selectedAnimal.name}'s information for later?</h4>
                        <button className='add-adopt-button' onClick={() => handleAdoptionConsideration(selectedAnimal)}>Click to add {selectedAnimal.name} <><br /> to your profile.</></button>
                        <button className='modal-close-button' onClick={() => {
                            setModalIsOpen(false)
                            setSelectedAnimal(null)
                        }}>X</button>
                    </div>
                    :
                    null}
                </Modal>
            </div>
        </>
    );
}

export default AnimalFeed;
