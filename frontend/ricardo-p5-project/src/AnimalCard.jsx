function AnimalCard({ animals, handleAnimalClick, profile, lowerIndex, filterAnimals}) {
    
    const animalsToMap = filterAnimals 
    ? (Array.isArray(filterAnimals) 
        ? filterAnimals.slice(lowerIndex, lowerIndex + 99) 
        : []
      ) 
    : (Array.isArray(animals) 
        ? animals.slice(lowerIndex, lowerIndex + 99) 
        : []
      );

    const mappedAnimals = animalsToMap.map(animal => {
        return (
            <div key={animal.id} className='animal-card' onClick={() => handleAnimalClick(animal)}>
                {animal.name ? <p className='animal-card-text'><strong>{animal.name}</strong></p> : null}
                {animal.photo ? (
                    <img 
                        src={animal.photo?.medium || 'default-image-url'} 
                        alt={animal.name}
                        onLoad={(e) => e.target.style.opacity = 1}
                        style={{opacity: 0, transition: 'opacity 0.5s', width: '10vw', padding: '1vw'}}
                    /> 
                ) : animal.species.toLowerCase() === 'dog' ? (
                    <img 
                        src='https://png.pngtree.com/png-clipart/20230308/ourmid/pngtree-cartoon-dog-sticker-cute-puppy-png-image_6629456.png' 
                        alt={animal.name} 
                        onLoad={(e) => e.target.style.opacity = 1}
                        style={{opacity: 0, transition: 'opacity 0.5s', width: '10vw', objectFit: 'contain', padding: '1vw'}}
                    />
                ) : animal.species.toLowerCase() === 'cat' ? (
                    <img 
                        src='https://static.vecteezy.com/system/resources/previews/013/078/569/non_2x/illustration-of-cute-colored-cat-cartoon-cat-image-in-format-suitable-for-children-s-book-design-elements-introduction-of-cats-to-children-books-or-posters-about-animal-free-png.png' 
                        alt={animal.name} 
                        onLoad={(e) => e.target.style.opacity = 1}
                        style={{opacity: 0, transition: 'opacity 0.5s', width: '10vw', objectFit: 'contain', padding: '1vw'}}
                    />
                ) : null}   
                {animal.species ? <p className='animal-card-text'>{animal.gender ? animal.gender + ' ': null}{animal.species}{animal.contact_address_city && animal.contact_address_state ? ' in ' + animal.contact_address_city + ', ' + animal.contact_address_state : null}</p> : null}
                {animal.age ? <p className='animal-card-text'>{animal.age}</p> : ''}
                <div>
                    {animal.breeds && (
                        animal.breeds.mixed || animal.breeds.secondary ? (
                            <p className='animal-card-text'>
                                {animal.breeds.primary ? `Breed: ${animal.breeds.primary}` : null}
                                {animal.breeds.secondary ? <><br/>Secondary Breed: {animal.breeds.secondary}</> : null}
                            </p>
                        ) : (
                            <p className='animal-card-text'>Breed: {animal.breeds.primary}</p>
                        ))}
                </div>
            </div>
        );
    });


    return (
        <div className='animal-card-container'>
            {mappedAnimals}
        </div>
    )

}

export default AnimalCard;
