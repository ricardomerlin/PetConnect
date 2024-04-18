import { useState, useEffect } from "react";

function DogPics() {
    const [dogPics, setDogPics] = useState([]);
    const [randomInt1, setRandomInt1] = useState(0);

    useEffect(() => {
        fetch('https://dog.ceo/api/breeds/image/random/50')
        .then((response) => response.json())
        .then((data) => {
            setDogPics(data.message);
        });
    }, []);

    
    useEffect(() => {
        const interval = setInterval(() => {
            const randomInt1 = Math.floor(Math.random() * dogPics.length);
            setRandomInt1(randomInt1);
        }, 10000);
    
        return () => clearInterval(interval);
    }, [dogPics]);

    return (
        <div className="login-pic-container">
            {(dogPics != 0) ? <img className='dog-pic1' src={dogPics[randomInt1]} alt='dog' /> : null}
        </div>
    );
}

export default DogPics