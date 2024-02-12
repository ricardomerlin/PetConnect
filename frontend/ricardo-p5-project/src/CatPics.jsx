import React, { useState, useEffect } from 'react';

function CatPics() {
    const [catUrl, setCatUrl] = useState('https://cataas.com/cat');

    useEffect(() => {
        const timeout = setTimeout
        const interval = setInterval(() => {
            setCatUrl(`https://cataas.com/cat?time=${new Date().getTime()}`);
        }, 11000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='login-pic-container'>
            <img className='cat-pic1' src={catUrl} alt="Cat" />
        </div>
    );
}

export default CatPics;