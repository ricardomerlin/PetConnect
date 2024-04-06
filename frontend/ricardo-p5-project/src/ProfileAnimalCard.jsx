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
    }
    
    
    const mappedProfileAnimals = () => (
        animals.map(animal => (
        <div key={animal.id} className="profile-animal-card">
            <h3 style={{marginBottom: '0'}}>{animal.name}</h3>
            <p>{animal.age} {animal.sex} {animal.primary_breed ? animal.primary_breed : animal.species}</p>  
            {animal.photo ? 
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
                    animal.species.toLowerCase() === 'sugar glider' ? 'data:image/jpeg;base64,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' :
                    animal.species.toLowerCase() === 'turtle' ? 'https://freepngimg.com/thumb/cute/29798-8-cute-turtle-image.png' :
                    'default_image_url'
                } style={{width: '50%', height: '50%', objectFit: 'contain'}}
            /> : null}
            <p>{animal.breed}</p>
            <a href={animal.url}>See more on {animal.name} here.</a>
            <button className='remove-from-profile' onClick={() => setShowDeleteConfirm(true)}>X</button>
            <DeleteConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => handleDeleteAnimal(animal)}
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