
function AnimalCard({ animals, onAdoptionConsideration }) {


    function mapTags(animal) {
        return (
            <div className="tags">
                {animal.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
        );
    }
    


    const mappedAnimals = Array.isArray(animals) ? animals.map(animal => {
        return (
            <div className="animal-card" key={animal.id} onDoubleClick={() => console.log(animal.name)}>
                {animal.name ? <h1>{animal.name}</h1> : null}
                {animal.species ? <h3>{animal.gender ? animal.gender + ' ': null}{animal.species}</h3> : null}
                {animal.age ? <h3>{animal.age}</h3> : ''}
                {animal.breeds && (
                    animal.breeds.mixed || animal.breeds.secondary ? (
                        <h3>
                            {animal.breeds.primary ? `Primary Breed: ${animal.breeds.primary}` : null}
                            {animal.breeds.secondary ? `, Secondary Breed: ${animal.breeds.secondary}` : null}
                        </h3>
                    ) : (
                        <h3>Breed: {animal.breeds.primary}</h3>
                    ))}
                {animal.photos[0] ? (
                    <img 
                        src={animal.photos[0]?.medium || 'default-image-url'} 
                        alt={animal.name} 
                        onLoad={(e) => e.target.style.opacity = 1}
                        style={{opacity: 0, transition: 'opacity 0.5s'}}
                    /> 
                ) : null}
                <div className="attributes">
                    <>
                        {(animal.species.toLowerCase() === 'cat') ? <h5>{animal.attributes.declawed ? 'Declawed: Yes' : 'Declawed: No'}</h5> : null}
                        <h5>{animal.attributes.house_trained ? 'House trained: Yes' : 'House trained: No'}</h5>
                        <h5>{animal.attributes.shots_current ? 'Up to date on shots: Yes' : 'Up to date on shots: No'}</h5>
                        {animal.attributes.spayed_neutered ? <h5>{(animal.gender.toLowerCase() === 'male') ? 'Neutered: Yes' : 'Spayed: Yes'}</h5> : <h5>{(animal.gender.toLowerCase() === 'male' ? 'Neutered: No' : 'Spayed: No')}</h5>}
                    </>
                </div>
                <div className='extra-info'>
                    <p>More on {animal.name}</p>
                    {mapTags(animal)}
                    {animal.colors.primary ? <h3>Color{animal.colors.secondary ? 's' : null}: {animal.colors.primary}{animal.colors.secondary ? ', ' + animal.colors.secondary : null}</h3> : null}
                    <h3>Interested in {animal.name}? <a href={animal.url} target="_blank" rel="noopener noreferrer">Adopt here!</a></h3>
                    <h4>Please feel free to save {animal.name}'s information for later.</h4>
                    <button onClick={() => onAdoptionConsideration(animal)}>Add to considering adoption</button>
                </div>
            </div>
        );
    }) : [];


    return (
        <div>
            {mappedAnimals}
        </div>
    )



}

export default AnimalCard
