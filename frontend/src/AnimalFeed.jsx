import { useEffect, useState } from "react";
import AnimalCard from "./AnimalCard";
import DogBreedFilter from "./DogBreedFilter";
import CatBreedFilter from "./CatBreedFilter";
import Modal from 'react-modal';
import './App.css'
import StateList from "./statelist";

Modal.setAppElement('#root')

function AnimalFeed({ profile, animals }) {
    const [counter, setCounter] = useState(0);
    const [isTop, setIsTop] = useState(true);
    const [savedAnimals, setSavedAnimals] = useState([]);
    const [saved, setSaved] = useState(false);

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


    const [lowerIndex, setLowerIndex] = useState(0);
    const [itemsPerPage] = useState(100);


    useEffect(() => {
        if (animals.length === 0) {
            const interval = setInterval(() => {
                setCounter(counter => counter === 10 ? 1 : counter + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [animals]);

    useEffect(() => {
        if (selectedAnimal) {
            checkSavedAnimal(selectedAnimal);
        }
        getSavedAnimals();
    }, [modalIsOpen]);

    useEffect(() => {
        getSavedAnimals()
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

    useEffect(() => {
        setFilterAnimals([]);
        if (!filterSubmit) {
            return;
        }
    
        let filteredAnimals = animals;
    
        if (species !== '') {
            filteredAnimals = filteredAnimals.filter(animal => animal.species.toLowerCase() === species);
        }
    
        if (species === 'dog' || species === 'cat') {
            if (breed !== '') {
                filteredAnimals = filteredAnimals.filter(animal => animal.primary_breed === breed);
            }
        }
    
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

    const handleAnimalClick = (animal) => {
        setSelectedAnimal(animal);
        setModalIsOpen(!modalIsOpen);
    };

    const getSavedAnimals = () => {
        fetch(`/api/saved_animals`)
        .then(res => res.json())
        .then(data => {
            setSavedAnimals(data)
        })
    }

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
            setSaved(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    
    const handleFilterSubmit = (e) => {
        e.preventDefault()
        setFilterSubmit(true)
    }

    const handleBreedSelection = (breed) => {
        setBreed(breed);
    };

    const handleNextPage = () => {
        setLowerIndex(prevIndex => {
            window.scrollTo(0, 0);
            return prevIndex + itemsPerPage;
        });
    };
    
    const handlePreviousPage = () => {
        setLowerIndex(prevIndex => {
            window.scrollTo(0, 0);
            return Math.max(prevIndex - itemsPerPage, 0);
        });
    };
    
    const checkSavedAnimal = (animal) => {
        console.log('check saved animal is running');
        let isSaved = false;
        for (let i = 0; i < savedAnimals.length; i++) {
            if (animal.petfinder_id === savedAnimals[i].petfinder_id) {
                console.log('some shit matched');
                isSaved = true;
                break;
            }
        }
        setSaved(isSaved);
    };
    
    
    return (
        <>
            <div className="main-page">
            <h1 className="page-title">Adoptable Animals</h1>
            <h2 style={{marginRight: '10vw', marginLeft: '10vw'}}>Welcome to our loving community of animal enthusiasts! Dive into our latest array of furry friends seeking forever homes. From playful pups to graceful felines, each profile is a tale of hope and companionship waiting to be shared. Click through and discover your next loyal companion today.</h2>
            <div className="animal-feed-container">
            <div className="filters" style={{ opacity: isTop ? 1 : 0, height: species ? '580px' : '525px' }}>
                    <form onSubmit={handleFilterSubmit}>
                        <h2 style={{marginBottom: '0'}}>Filter by:</h2>
                        <div className="filter-group">
                            <div>
                                <p>Species:</p>
                                <select
                                    className='species-select'
                                    onChange={(e) => setSpecies(e.target.value)}
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
                                </select>
                            </div>
                            <div>
                            {species === 'dog' &&
                                <div style={{margin: '0'}}>
                                    <p>Breed:</p>
                                    <DogBreedFilter handleBreedSelection={handleBreedSelection} />
                                </div>
                            }
                            {species === 'cat' &&
                                <div style={{margin: '0'}}>
                                    <p>Breed:</p>
                                    <CatBreedFilter handleBreedSelection={handleBreedSelection} />
                                </div>
                            }
                            </div>
                        </div>
                        <div className="filter-group">
                            <div>
                                <p style={{margin: '0'}}>Age:</p>
                                <select
                                    className='age-select'
                                    onChange={(e) => setAge(e.target.value)}
                                >
                                    <option value="">Any</option>
                                    <option value="baby">Baby</option>
                                    <option value="young">Young</option>
                                    <option value="adult">Adult</option>
                                    <option value="senior">Senior</option>
                                </select>
                            </div>
                            <div>
                                <p>Size:</p>
                                <select
                                    className='size-select'
                                    onChange={(e) => setSize(e.target.value)}
                                >
                                    <option value="">Any</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                    <option value="extra-large">Extra Large</option>
                                </select>
                            </div>
                        </div>
                        <div className="filter-group">
                            <div>
                                <input
                                    type="checkbox"
                                    id="good-with-cats"
                                    name="good-with-cats"
                                    value="good-with-cats"
                                    onChange={(e) => setGoodWithCats(e.target.checked)}
                                />
                                <label htmlFor="good-with-cats">Good with Cats</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    id="good-with-dogs"
                                    name="good-with-dogs"
                                    value="good-with-dogs"
                                    onChange={(e) => setGoodWithDogs(e.target.checked)}
                                />
                                <label htmlFor="good-with-dogs">Good with Dogs</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    id="good-with-children"
                                    name="good-with-children"
                                    value="good-with-children"
                                    onChange={(e) => setGoodWithChildren(e.target.checked)}
                                />
                                <label htmlFor="good-with-children">Good with Children</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    id="house-trained"
                                    name="house-trained"
                                    value="house-trained"
                                    onChange={(e) => setHouseTrained(e.target.checked)}
                                />
                                <label htmlFor="house-trained">House Trained</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    id="declawed"
                                    name="declawed"
                                    value="declawed"
                                    onChange={(e) => setDeclawed(e.target.checked)}
                                />
                                <label htmlFor="declawed">Declawed</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    id="spayed-neutered"
                                    name="spayed-neutered"
                                    value="spayed-neutered"
                                    onChange={(e) => setSpayedNeutered(e.target.checked)}
                                />
                                <label htmlFor="spayed-neutered">Spayed/Neutered</label>
                            </div>
                        </div>
                        <div className="filter-group">
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <label htmlFor="city" style={{borderRadius: '10px'}}>City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div style={{display:'flex', justifyContent:'center', marginTop: '10px'}}>
                                <label htmlFor="state">State</label>
                                <select
                                    type="text"
                                    id="state"
                                    name="state"
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <StateList />
                                </select>
                            </div>
                        </div>
                        <div className="filter-buttons">
                            {filterSubmit ? null : <button>Search</button>}
                            {filterSubmit &&
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilterSubmit(false);
                                        setFilterAnimals([]);
                                        setSpecies('');
                                        setBreed('');
                                        setLowerIndex(0);
                                    }}
                                >
                                    Clear Filters
                                </button>
                            }
                        </div>
                    </form>
                </div>
                {
                (animals.length === 0)
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
                <div className="pagination-buttons">
                    <button onClick={handlePreviousPage} disabled={lowerIndex === 0} className="previous-button">Previous Page</button>
                    <button onClick={handleNextPage} disabled={lowerIndex + itemsPerPage >= animals.length} className="next-button">Next Page</button>
                </div>
                <Modal
                    appElement={document.getElementById('root')}
                    isOpen={modalIsOpen}
                    contentLabel="Animal Details"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        content: {
                            margin: 'auto',
                            borderRadius: '20px',
                            border: '2px solid #ccc', 
                            padding: '0'        
                        }
                    }}
                >
                    {selectedAnimal
                    ?
                    <div className="modal-container-with-name">
                    <h1 style={{marginBottom:'0'}}>{selectedAnimal.name}</h1>
                    <h2><strong>{selectedAnimal.age} {selectedAnimal.sex} {selectedAnimal.primary_breed}</strong></h2>
                    {selectedAnimal.status ? <p style={{color: 'green', fontSize: '15px'}}><strong>Available!</strong></p> : <p style={{color: 'red', fontSize: '15px'}}><strong>Unavailable</strong></p>}
                    <div className="modal-container">
                        <div className='modal-animal-left'>
                            <p className='animal-card-text'>
                            </p>
                                <img 
                                    src={
                                        selectedAnimal.photo ? selectedAnimal.photo :
                                        selectedAnimal.species.toLowerCase() === 'alpaca' ? 'https://static.vecteezy.com/system/resources/previews/036/444/746/original/ai-generated-cute-alpaca-cartoon-illustration-for-kids-on-transparent-background-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'cat' ? 'https://static.vecteezy.com/system/resources/previews/013/078/569/non_2x/illustration-of-cute-colored-cat-cartoon-cat-image-in-format-suitable-for-children-s-book-design-elements-introduction-of-cats-to-children-books-or-posters-about-animal-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'chicken' ? 'https://www.pngmart.com/files/23/Cartoon-Chicken-PNG-Transparent.png' :
                                        selectedAnimal.species.toLowerCase() === 'chinchilla' ? 'https://static.vecteezy.com/system/resources/previews/027/510/357/non_2x/charming-chinchilla-delightful-fluffball-of-cuteness-ai-generative-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'dog' ? 'https://png.pngtree.com/png-clipart/20230308/ourmid/pngtree-cartoon-dog-sticker-cute-puppy-png-image_6629456.png' :
                                        selectedAnimal.species.toLowerCase() === 'dove' ? 'https://clipart-library.com/img/1852675.png' :
                                        selectedAnimal.species.toLowerCase() === 'duck' ? 'https://static.vecteezy.com/system/resources/previews/036/444/736/original/ai-generated-cute-duck-cartoon-illustration-for-kids-on-transparent-background-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'ferret' ? 'https://images.vexels.com/media/users/3/203118/isolated/preview/a414a1416aa407224fd5e48d5f609b2c-cute-standing-ferret-illustration.png' :
                                        selectedAnimal.species.toLowerCase() === 'finch' ? 'https://png.pngtree.com/png-vector/20230728/ourmid/pngtree-finch-clipart-yellow-bird-is-standing-beside-a-white-background-cartoon-vector-png-image_6809042.png' :
                                        selectedAnimal.species.toLowerCase() === 'gerbil' ? 'https://aaah0mnbncqtinas.public.blob.vercel-storage.com/bzVHDbdIgZ-no-background-YdoIn3RrmvwZ8EGl9sTNyLDhNd6Q6t.png' :
                                        selectedAnimal.species.toLowerCase() === 'goat' ? 'https://static.vecteezy.com/system/resources/previews/023/546/324/original/transparent-background-cartoon-goat-adding-whimsy-to-your-designs-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'guinea pig' ? 'https://images.vexels.com/media/users/3/281849/isolated/preview/0d22822dea9043bcb28254a433e0db6d-guinea-pig-pet-animals.png' :
                                        selectedAnimal.species.toLowerCase() === 'hamster' ? 'https://static.vecteezy.com/system/resources/previews/033/654/605/original/cute-hamster-cartoon-clipart-ai-generative-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'horse' ? 'https://pngfre.com/wp-content/uploads/horse-png-from-pngfre-18.png' :
                                        selectedAnimal.species.toLowerCase() === 'mouse' ? 'https://static.vecteezy.com/system/resources/thumbnails/012/629/799/small/the-grey-mouth-png.png' : 
                                        selectedAnimal.species.toLowerCase() === 'parakeet' ? 'https://static.vecteezy.com/system/resources/previews/012/414/498/original/cute-cartoon-parrot-illustration-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'parrot' ? 'https://www.freeiconspng.com/thumbs/parrot-png/parrot-png-17.png' :
                                        selectedAnimal.species.toLowerCase() === 'rabbit' ? 'https://static.vecteezy.com/system/resources/previews/024/044/241/non_2x/rabbit-clipart-transparent-background-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'rat' ? 'https://upload.wikimedia.org/wikipedia/commons/a/a0/201109_rat.png' :
                                        selectedAnimal.species.toLowerCase() === 'reptile' ? 'https://pngimg.com/d/gecko_PNG2.png' :
                                        selectedAnimal.species.toLowerCase() === 'sheep' ? 'https://static.vecteezy.com/system/resources/previews/024/043/977/original/sheep-icon-clipart-transparent-background-free-png.png' :
                                        selectedAnimal.species.toLowerCase() === 'snake' ? 'https://png.pngtree.com/png-clipart/20230413/original/pngtree-cartoon-snake-green-png-image_9051656.png' :
                                        selectedAnimal.species.toLowerCase() === 'sugar glider' ? 'https://aaah0mnbncqtinas.public.blob.vercel-storage.com/2jHo3agFnx-no-background-6bCUiwZyWSWtgO6H2B8E0WZQ8ERume.png' :
                                        selectedAnimal.species.toLowerCase() === 'turtle' ? 'https://freepngimg.com/thumb/cute/29798-8-cute-turtle-image.png' :
                                        'https://upload.wikimedia.org/wikipedia/commons/1/1e/Heart-SG2001-transparent.png'
                                    }
                                    alt={selectedAnimal.name} 
                                    onLoad={(e) => e.target.style.opacity = 1}
                                    style={{opacity: 0, transition: 'opacity 0.5s', height: '350px', marginBottom: '30px', borderRadius: '20px', maxWidth: '400px'}}
                                />
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div className="left-card">
                                {selectedAnimal.primary_color ? <p><u><strong>Color:</strong></u><br />{selectedAnimal.primary_color}</p> : null}
                                <p><u><strong>{(selectedAnimal.sex.toLowerCase() === 'male') ? 'Neutered?' : 'Spayed?'}</strong></u><br />{selectedAnimal.spayed_neutered === '1' ? ' Yes' : ' No'}</p>
                                <p><u><strong>House trained?</strong></u><br />{selectedAnimal.house_trained === '1' ? ' Yes' : ' No'}</p>                            
                            </div>
                            <div className="right-card">
                                <p><u><strong>Up to date on shots?</strong></u><br />{selectedAnimal.shots === '0' ? ' Yes' : ' No'}</p>
                                <p><u><strong>Size:</strong></u> <br /> {selectedAnimal.size}</p>
                                <p><u><strong>Special needs:</strong></u><br />{selectedAnimal.special_needs === '1' ? ' Yes' : ' No'}</p>
                                {(selectedAnimal.species.toLowerCase() === 'cat') ? <p><u><strong>Declawed:</strong></u>{selectedAnimal.declawed === '1' ? ' Yes' : ' No'}</p> : null}                                
                            </div>
                            </div>
                        </div>
                        <div className="modal-animal-right">
                            <p className="environment-text"><strong>Environment:</strong>
                                <span className="environment-condition">{selectedAnimal.good_with_cats ? "✔️ Good with cats." : "ⅹ Not good with cats."}</span>
                                <span className="environment-condition">{selectedAnimal.good_with_dogs ? "✔️ Good with dogs." : "ⅹ Not good with dogs."}</span>
                                <span className="environment-condition">{selectedAnimal.good_with_children ? "✔️ Good with children." : "ⅹ Not good with children."}</span>
                            </p>
                            {selectedAnimal.contact_address || selectedAnimal.contact_email || selectedAnimal.contact_phone ? 
                            <p className="contact-information" style={{margin: '10px'}}><strong>Contact Information:</strong>
                                {selectedAnimal.contact_address_city || selectedAnimal.contact_address_state ? 
                                <span className="contact-text">
                                    <strong>Location: </strong>{selectedAnimal.contact_address_city}, {selectedAnimal.contact_address_state}                                       
                                    </span> 
                                : null}                                
                                {selectedAnimal.contact_email ? (
                                <span className="contact-text">
                                    <strong>Email:</strong>
                                    <span className='email-address'>{selectedAnimal.contact_email}</span>
                                </span>
                                ) : null}
                                {selectedAnimal.contact_phone ? (
                                <span className="contact-text" style={{ marginLeft: '10px' }}>
                                    <strong>Phone:</strong>
                                    <span className="phone-number">{selectedAnimal.contact_phone}</span>
                                </span>
                                ) : null}
                            </p>
                            :
                            null}
                        <button className='modal-close-button' onClick={() => {
                            setModalIsOpen(false)
                            setSelectedAnimal(null)
                        }}>X</button>
                    </div>
                    </div>
                    <h5 className='animal-card-text'>Interested in {selectedAnimal.name}? Submit an inquiry <a href={selectedAnimal.url} target="_blank" rel="noopener noreferrer">here</a>, or save {selectedAnimal.name}'s information for later.</h5>
                    {saved ? <h3 style={{marginTop: '40px'}}>{selectedAnimal.name} has been saved to your profile!</h3> : <button className='add-adopt-button' onClick={() => handleAdoptionConsideration(selectedAnimal)}>Add {selectedAnimal.name}'s<><br /> information to your profile.</></button> }
                    </div>
                    :
                    null}
                </Modal>
            </div>
        </>
    );
}

export default AnimalFeed;
