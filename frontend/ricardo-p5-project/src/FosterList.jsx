import { useState, useEffect } from 'react'

function FosterList({ profile }) {

    const [fosterListings, setFosterListings] = useState([])
    // const [fname, setFname] = useState('')
    // const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [preference, setPreference] = useState('dog')

    useEffect(() => {
        getFosterListings()
    }, [])

    function getFosterListings() {
        fetch('/foster_listings')
        .then(res => res.json())
        .then(data => {
            setFosterListings(data)
        })
    }


    console.log(profile.id)

    function handleFosterListings (e) {
        e.preventDefault()
        if (profile) {
            for (let i = 0; i < fosterListings.length; i++)
                if (fosterListings[i].profile_id === profile.id) {
                    return alert('You already have a listing')
                }
            fetch('/foster_listings', {
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
                    'profile_id': profile.id
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
        fetch(`/foster_listings/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setFosterListings(fosterListings.filter(listing => listing.profile_id !== profile.id))
        })
    }

    return (
        <div className='foster-component-container'>
            <h1 className='page-title'>Sign up to Foster</h1>
            <h2>Interested in fostering an animal? Add your information to our foster list to receive foster requests when help is needed in your area.</h2>
            <div className='form-and-listings-container'>
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
                    <button type='submit'>Submit</button>
                </form>
                </div>
                <div className='foster-listings-container'>
                    {fosterListings.map(listing => {
                        return (
                            <div key={listing.id} className='foster-listing'>
                                <h2>{listing.name}</h2>
                                <p>{listing.email_address}</p>
                                <p>{listing.city}, {listing.state}</p>
                                <p>Interesting in fostering {listing.preference}s</p>
                                {listing.profile_id === profile.id && (
                                    <button onClick={() => deleteListing(listing.id)}>Delete</button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}

export default FosterList