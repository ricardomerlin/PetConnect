import { useState, useEffect } from 'react'
import StateList from './statelist'


function FosterList({ profile }) {

    const [fosterListings, setFosterListings] = useState([])
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [preference, setPreference] = useState('dog')
    const [description, setDescription] = useState('')

    const [filterCity, setFilterCity] = useState('')
    const [filterState, setFilterState] = useState('')

    const [listingExists, setListingExists] = useState(false)

    useEffect(() => {
        getFosterListings()
    }, [])

    function getFosterListings() {
        fetch('/api/foster_listings')
        .then(res => res.json())
        .then(data => {
            setFosterListings(data)

            const exists = data.some(listing => listing.profile_id === profile.id)
            setListingExists(exists)
        })
    }

    function handleFilterChange(e, setFilter) {
        setFilter(e.target.value)
    }

    function filterLocation (e) {
        e.preventDefault()
        const filteredListings = fosterListings.filter(listing => listing.city.toLowerCase().includes(filterCity.toLowerCase()) && listing.state.toLowerCase().includes(filterState.toLowerCase()))
        setFosterListings(filteredListings)
    }



    function handleFosterListings (e) {
        e.preventDefault()
        if (profile) {
            for (let i = 0; i < fosterListings.length; i++)
                if (fosterListings[i].profile_id === profile.id) {
                    return alert('You already have a listing')
                }
            fetch('/api/foster_listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'name': profile.name,
                    'email_address': email,
                    'city': city,
                    'state': state,
                    'preference': preference,
                    'profile_id': profile.id,
                    'description': description
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setFosterListings([...fosterListings, data])
                getFosterListings()
            })
            }
        }

    function deleteListing(id) {
        fetch(`/api/foster_listings/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setFosterListings(fosterListings.filter(listing => listing.profile_id !== profile.id))
        })
    }

    console.log(description)

    return (
        <div className='foster-component-container'>
            <h1 className='page-title'>Sign up to Foster</h1>
            <h2>Interested in fostering an animal? Add your information to our foster list to receive foster requests when help is needed in your area.</h2>
            <div className='form-and-listings-container' style={listingExists ? { justifyContent: 'center' } : {}}>                {!listingExists && (
                <div className='foster-form-container'>
                <form onSubmit={handleFosterListings}>
                    <label>Email Address</label>
                    <input type='text' onChange={(e) => setEmail(e.target.value)}></input>
                    <br/>
                    <br/>
                    <label>City: </label>
                    <input type='text' onChange={(e) => setCity(e.target.value)}></input>
                    <br/>
                    <br/>
                    <label>State: </label>
                    <select onChange={(e) => setState(e.target.value)}>
                    <StateList />
                    </select>
                    <br/>
                    <br/>
                    <label>Animal Preference: </label>
                    <select type='' onChange={(e) => setPreference(e.target.value)}>
                        <option value='dog'>Dog</option>
                        <option value='cat'>Cat</option>
                        <option value='other'>Other</option>
                    </select>
                    <br/>
                    <br/>
                    <label>Tell us about yourself. Why foster? Do you currently have any pets, or have you had pets before? </label>
                    <br />
                    <textarea 
                        rows="4" 
                        cols="50" 
                        wrap="soft" 
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <br/>
                    <br/>
                    <button type='submit' disabled={!email || !city || !state || !preference || !description}>Submit</button>                    
                    </form>
                    </div>
                    )}
                    <div style={{width: '75%', display: 'flex', flexDirection: 'column'}}>
                        <form>
                            <label>Filter by City: </label>
                                <input type='text' onChange={(e) => handleFilterChange(e, setFilterCity)}></input>
                                <br/>
                                <br/>
                                <label>State: </label>
                                <select onChange={(e) => handleFilterChange(e.target.value, setFilterState)}>
                                <StateList />
                                </select>
                                <br/>
                                <br/>
                            {fosterListings.length > 0 ? <button onClick={filterLocation} disabled={!filterCity}>Filter</button> : <button onClick={getFosterListings}>Reset</button>}
                        </form>
                        <div className='foster-listings-container'>
                            {fosterListings.map(listing => {
                                return (
                                    <div key={listing.id} className='foster-listing'>
                                        <h2 style={{ color: 'purple', textAlign: 'center', fontSize: '20px', marginBottom: '0' }}><u>{listing.name}</u></h2>
                                        <p style={{fontSize: '15px', marginTop: '0'}}><strong>Wants to foster:</strong> {listing.preference}s</p>
                                        <p style={{margin: '3px'}}><strong>Email:</strong> {listing.email_address}</p>
                                        <p style={{margin: '3px'}}><strong>Location:</strong> {listing.city}, {listing.state}</p>
                                        <p style={{marginTop: '3px', marginBottom: '5px'}}><strong>About:</strong> {listing.description}</p>
                                        {listing.profile_id === profile.id && (
                                            <div>
                                                <p style={{marginBottom: '0px', marginTop: '20px'}}>No longer available?</p>
                                                <a href='#' style={{ color: 'red' }} onClick={() => {
                                                    deleteListing(listing.id)
                                                    setListingExists(false)
                                                }
                                                }>Remove your listing</a>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
            </div>
        </div>

    )
}

export default FosterList