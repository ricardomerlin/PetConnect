import { useEffect, useState } from "react";
import AnimalCard from "./AnimalCard";
import './App.css'

function AnimalFeed({ profile }) {
    const [animals, setAnimals] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [filterPageCount, setFilterPageCount] = useState(1)
    const [fetchError, setFetchError] = useState(false)

    const [filterSubmit, setFilterSubmit] = useState(false)

    const [species, setSpecies] = useState('')

    // const [type, setType] = React.useState('');
    // const [breed, setBreed] = React.useState('');
    // const [size, setSize] = React.useState('');
    // const [gender, setGender] = React.useState('');
    // const [age, setAge] = React.useState('');
    // const [color, setColor] = React.useState('');
    // const [coat, setCoat] = React.useState('');
    // const [status, setStatus] = React.useState('');
    // const [name, setName] = React.useState('');
    // const [organization, setOrganization] = React.useState('');
    // const [goodWithChildren, setGoodWithChildren] = React.useState('');
    // const [goodWithDogs, setGoodWithDogs] = React.useState('');
    // const [goodWithCats, setGoodWithCats] = React.useState('');
    // const [houseTrained, setHouseTrained] = React.useState('');
    // const [declawed, setDeclawed] = React.useState('');
    // const [specialNeeds, setSpecialNeeds] = React.useState('');
    // const [location, setLocation] = React.useState('');
    // const [distance, setDistance] = React.useState('');
    // const [before, setBefore] = React.useState('');
    // const [after, setAfter] = React.useState('');
    // const [sort, setSort] = React.useState('');

    function fetchAnimals(retries = 5) {
        fetch(`http://127.0.0.1:5555/api/animals?page=${pageCount}`)
        .then(response => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then(data => {
            setAnimals(data.animals)
            setFetchError(false)
        })
        .catch((error) => {
            if (retries > 0) {
                setTimeout(() => fetchAnimals(retries - 1), 1000);
            } else {
                console.error('Error:', error);
                setFetchError(true)
            }
        });
    }
    console.log(filterSubmit)


    useEffect(() => {
        if (!filterSubmit) {
            return;
        }
    
        console.log('about to fetch')
        fetch(`https://api.petfinder.com/v2/types/${species}`)
        .then(response => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then(data => {
            setAnimals(data.type)
            setFetchError(false)
            console.log(data.type)
        })
        .then(() => (
            setFilterSubmit(false)
        ))
        .catch((error) => {
            if (retries > 0) {
                setTimeout(() => fetchAnimals(retries - 1), 1000);
            } else {
                console.error('Error:', error);
                setFetchError(true)
            }
        });
    }, [filterSubmit, species])

    useEffect(() => {
        fetchAnimals();
    }, [pageCount, fetchError]); 

    
console.log(profile.id)

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
    
    console.log(species)

    const handleFilterSubmit = (e) => {
        e.preventDefault()
        setFilterSubmit(true)
    }

    return (
        <>
            <div className="App">
                <h1>Animal Feed</h1>
                <div className="animal-feed-container">
                    <div className="filters">
                        <form onSubmit={handleFilterSubmit}>
                            <h3>Filters:</h3>
                            <select onChange={(e) => setSpecies(e.target.value)}>
                                <option value="">Select a species</option>
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                            </select>
                            <label>
                                <input type="checkbox" />
                                Filter by Age
                            </label>
                            <label>
                                <input type="checkbox" />
                                Filter by Size
                            </label>
                            <button>Search</button>
                        </form>
                    </div>
                    <AnimalCard 
                        animals={animals} 
                        onAdoptionConsideration={handleAdoptionConsideration} 
                        profile={profile}/>
                </div>
                <button onClick={() => setPageCount(pageCount === 1 ? page == 1 : pageCount - 1)}>Previous Page</button>
                <button onClick={() => setPageCount(pageCount + 1)}>Next Page</button>
            </div>
        </>
    )
}

export default AnimalFeed