import { useState, useEffect } from 'react'

function FosterList({ profile }) {

    const [fosterListings, setFosterListings] = useState([])
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [preference, setPreference] = useState('dog')

    useEffect(() => {
        getFosterListings()
    }, [])

    function getFosterListings() {
        fetch('http://127.0.0.1:5555/foster_listings')
        .then(res => res.json())
        .then(data => {
            setFosterListings(data)
        })
    }


    console.log(profile.id)

    function handleFosterListings (e) {
        e.preventDefault()
        for (let i = 0; i < fosterListings.length; i++)
            if (fosterListings[i].profile_id === profile.id) {
                return alert('You already have a listing')
            }
        fetch('http://127.0.0.1:5555/foster_listings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': fname + ' ' + lname,
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



    return (
        <div className='foster-component-container'>
            <h1>Want to Foster an Animal? Add your information here to receive foster requests when help is needed in your area.</h1>
            <div className='foster-form-container'>
            <form onSubmit={handleFosterListings}>
                <label>First Name</label>
                <input type='text' onChange={(e) => setFname(e.target.value)}></input>
                <label>Last Name</label>
                <input type='text' onChange={(e) => setLname(e.target.value)}></input>
                <label>Email Address</label>
                <input type='text' onChange={(e) => setEmail(e.target.value)}></input>
                <label>City</label>
                <input type='text' onChange={(e) => setCity(e.target.value)}></input>
                <label>State</label>
                <input type='text' onChange={(e) => setState(e.target.value)}></input>
                <label>Preference</label>
                <select type='' onChange={(e) => setPreference(e.target.value)}>
                    <option value='dog'>Dog</option>
                    <option value='cat'>Cat</option>
                    <option value='other'>Other</option>
                </select>
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
                            <p>{listing.preference}</p>
                        </div>
                    )
                })}
            </div>
        </div>

    )
}

export default FosterList