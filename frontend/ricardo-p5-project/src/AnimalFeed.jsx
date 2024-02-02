import { useEffect, useState } from "react";
import AnimalCard from "./AnimalCard";

function AnimalFeed({ profileId }) {
    const [animals, setAnimals] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [fetchError, setFetchError] = useState(false)

    function fetchAnimals(retries = 5) {
        fetch(`http://127.0.0.1:5555/api/animals?page=${pageCount}`)
        .then(response => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then(data => {
            setAnimals(data.animals)
            setFetchError(false)  // Reset the fetch error state
        })
        .catch((error) => {
            if (retries > 0) {
                // Retry after 1 second
                setTimeout(() => fetchAnimals(retries - 1), 1000);
            } else {
                console.error('Error:', error);
                setFetchError(true)  // Set the fetch error state
            }
        });
    }

    useEffect(() => {
        fetchAnimals();
    }, [pageCount, fetchError]);  // Add fetchError as a dependency
    
    function handleAdoptionConsideration(animal) {
        fetch('http://127.0.0.1:5555/save_animal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(animal),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    
    console.log(animals)

    return (
        <>
            <div className="App">
                <h1>Animal Feed</h1>
                <AnimalCard animals={animals} onAdoptionConsideration={handleAdoptionConsideration}/>
                <button onClick={() => setPageCount(pageCount === 1 ? page == 1 : pageCount - 1)}>Previous Page</button>
                <button onClick={() => setPageCount(pageCount + 1)}>Next Page</button>
            </div>
        </>
    )
}

export default AnimalFeed