import { useState, useEffect } from 'react'

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
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
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
                    <button type='submit'>Submit</button>
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
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                                </select>
                                <br/>
                                <br/>
                            {fosterListings.length > 0 ? <button onClick={filterLocation}>Filter</button> : <button onClick={getFosterListings}>Reset</button>}
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