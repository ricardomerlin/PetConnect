import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

function ProfileAnimalCard({ animals, onDelete }) {

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteAnimal = (animal) => {
        onDelete(animal)
        fetch(`api/animals/${animal.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            onDelete(animal)
        })
        .catch(error => console.error('Error:', error));
        setShowDeleteConfirm(false);
    }
    
    
    const mappedProfileAnimals = () => (
        animals.map(animal => (
        <div key={animal.id} className="profile-animal-card">
            <h3 style={{marginBottom: '0'}}>{animal.name}</h3>
            <p style={{marginTop: '0'}}>{animal.age} {animal.sex} {animal.primary_breed ? animal.primary_breed : animal.species} in {animal.contact_address_city}, {animal.contact_address_state}</p>
            
            <img
            src={
                animal.photo ? animal.photo :
                animal.species.toLowerCase() === 'alpaca' ? 'https://static.vecteezy.com/system/resources/previews/036/444/746/original/ai-generated-cute-alpaca-cartoon-illustration-for-kids-on-transparent-background-free-png.png' :
                animal.species.toLowerCase() === 'cat' ? 'https://static.vecteezy.com/system/resources/previews/013/078/569/non_2x/illustration-of-cute-colored-cat-cartoon-cat-image-in-format-suitable-for-children-s-book-design-elements-introduction-of-cats-to-children-books-or-posters-about-animal-free-png.png' :
                animal.species.toLowerCase() === 'chicken' ? 'https://www.pngmart.com/files/23/Cartoon-Chicken-PNG-Transparent.png' :
                animal.species.toLowerCase() === 'chinchilla' ? 'https://static.vecteezy.com/system/resources/previews/027/510/357/non_2x/charming-chinchilla-delightful-fluffball-of-cuteness-ai-generative-free-png.png' :
                animal.species.toLowerCase() === 'dog' ? 'https://png.pngtree.com/png-clipart/20230308/ourmid/pngtree-cartoon-dog-sticker-cute-puppy-png-image_6629456.png' :
                animal.species.toLowerCase() === 'dove' ? 'https://clipart-library.com/img/1852675.png' :
                animal.species.toLowerCase() === 'duck' ? 'https://static.vecteezy.com/system/resources/previews/036/444/736/original/ai-generated-cute-duck-cartoon-illustration-for-kids-on-transparent-background-free-png.png' :
                animal.species.toLowerCase() === 'ferret' ? 'https://images.vexels.com/media/users/3/203118/isolated/preview/a414a1416aa407224fd5e48d5f609b2c-cute-standing-ferret-illustration.png' :
                animal.species.toLowerCase() === 'finch' ? 'https://png.pngtree.com/png-vector/20230728/ourmid/pngtree-finch-clipart-yellow-bird-is-standing-beside-a-white-background-cartoon-vector-png-image_6809042.png' :
                animal.species.toLowerCase() === 'gerbil' ? 'https://aaah0mnbncqtinas.public.blob.vercel-storage.com/bzVHDbdIgZ-no-background-YdoIn3RrmvwZ8EGl9sTNyLDhNd6Q6t.png' :
                animal.species.toLowerCase() === 'goat' ? 'https://static.vecteezy.com/system/resources/previews/023/546/324/original/transparent-background-cartoon-goat-adding-whimsy-to-your-designs-free-png.png' :
                animal.species.toLowerCase() === 'guinea pig' ? 'https://images.vexels.com/media/users/3/281849/isolated/preview/0d22822dea9043bcb28254a433e0db6d-guinea-pig-pet-animals.png' :
                animal.species.toLowerCase() === 'hamster' ? 'https://static.vecteezy.com/system/resources/previews/033/654/605/original/cute-hamster-cartoon-clipart-ai-generative-free-png.png' :
                animal.species.toLowerCase() === 'horse' ? 'https://pngfre.com/wp-content/uploads/horse-png-from-pngfre-18.png' :
                animal.species.toLowerCase() === 'mouse' ? 'https://static.vecteezy.com/system/resources/thumbnails/012/629/799/small/the-grey-mouth-png.png' : 
                animal.species.toLowerCase() === 'parakeet' ? 'https://static.vecteezy.com/system/resources/previews/012/414/498/original/cute-cartoon-parrot-illustration-png.png' :
                animal.species.toLowerCase() === 'parrot' ? 'https://www.freeiconspng.com/thumbs/parrot-png/parrot-png-17.png' :
                animal.species.toLowerCase() === 'rabbit' ? 'https://static.vecteezy.com/system/resources/previews/024/044/241/non_2x/rabbit-clipart-transparent-background-free-png.png' :
                animal.species.toLowerCase() === 'rat' ? 'https://upload.wikimedia.org/wikipedia/commons/a/a0/201109_rat.png' :
                animal.species.toLowerCase() === 'sheep' ? 'https://static.vecteezy.com/system/resources/previews/024/043/977/original/sheep-icon-clipart-transparent-background-free-png.png' :
                animal.species.toLowerCase() === 'snake' ? 'https://png.pngtree.com/png-clipart/20230413/original/pngtree-cartoon-snake-green-png-image_9051656.png' :
                animal.species.toLowerCase() === 'sugar glider' ? 'https://aaah0mnbncqtinas.public.blob.vercel-storage.com/2jHo3agFnx-no-background-6bCUiwZyWSWtgO6H2B8E0WZQ8ERume.png' :
                animal.species.toLowerCase() === 'turtle' ? 'https://freepngimg.com/thumb/cute/29798-8-cute-turtle-image.png' :
                'https://upload.wikimedia.org/wikipedia/commons/1/1e/Heart-SG2001-transparent.png'
            } style={{height: '200px', objectFit: 'contain'}} />
            <p>{animal.breed}</p>
            <a href={animal.url}>See more on {animal.name} here.</a>
            <h4 style={{color: animal.status == 'adoptable' ? 'green' : 'red'}}>{animal.status == 'adoptable' ? 'Available for Adoption!' : 'No longer available.'}</h4>
            <button className='remove-from-profile' onClick={() => setShowDeleteConfirm(true)}>X</button>
            <DeleteConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => handleDeleteAnimal(animal)}
            animal={animal}
            />
        </div>
        )))

    return (
        <div className="animal-profile-container">
            {mappedProfileAnimals()}
        </div>
    )

}

export default ProfileAnimalCard;