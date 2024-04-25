function DogBreedFilter({ handleBreedSelection }) {
    return (
        <select className='breed-select' onChange={(e) => handleBreedSelection(e.target.value)}>
            <option value="">Select a breed</option>
            <option value="Affenpinscher">Affenpinscher</option>
            <option value="Akita">Akita</option>
            <option value="Alaskan Malamute">Alaskan Malamute</option>
            <option value="American Staffordshire Terrier">American Staffordshire Terrier</option>
            <option value="Australian Shepherd">Australian Shepherd</option>
            <option value="Basenji">Basenji</option>
            <option value="Basset Hound">Basset Hound</option>
            <option value="Beagle">Beagle</option>
            <option value="Bernese Mountain Dog">Bernese Mountain Dog</option>
            <option value="Bichon Frise">Bichon Frise</option>
            <option value="Border Collie">Border Collie</option>
            <option value="Boston Terrier">Boston Terrier</option>
            <option value="Boxer">Boxer</option>
            <option value="Bulldog">Bulldog</option>
            <option value="Chihuahua">Chihuahua</option>
            <option value="Chocolate Labrador Retriever">Chocolate Labrador Retriever</option>
            <option value="Cocker Spaniel">Cocker Spaniel</option>
            <option value="Dachshund">Dachshund</option>
            <option value="Dalmatian">Dalmatian</option>
            <option value="Doberman Pinscher">Doberman Pinscher</option>
            <option value="English Bulldog">English Bulldog</option>
            <option value="French Bulldog">French Bulldog</option>
            <option value="German Shepherd">German Shepherd</option>
            <option value="Golden Retriever">Golden Retriever</option>
            <option value="Goldendoodle">Goldendoodle</option>
            <option value="Great Dane">Great Dane</option>
            <option value="Greyhound">Greyhound</option>
            <option value="Havanese">Havanese</option>
            <option value="Husky">Husky</option>
            <option value="Jack Russell Terrier">Jack Russell Terrier</option>
            <option value="Labrador Retriever">Labrador Retriever</option>
            <option value="Maltese">Maltese</option>
            <option value="Mastiff">Mastiff</option>
            <option value="Miniature Pinscher">Miniature Pinscher</option>
            <option value="Miniature Schnauzer">Miniature Schnauzer</option>
            <option value="Papillon">Papillon</option>
            <option value="Pekingese">Pekingese</option>
            <option value="Pit Bull Terrier">Pit Bull Terrier</option>
            <option value="Pomeranian">Pomeranian</option>
            <option value="Poodle">Poodle</option>
            <option value="Rottweiler">Rottweiler</option>
            <option value="Saint Bernard">Saint Bernard</option>
            <option value="Samoyed">Samoyed</option>
            <option value="Scottish Terrier">Scottish Terrier</option>
            <option value="Schnauzer">Schnauzer</option>
            <option value="Shar Pei">Shar Pei</option>
            <option value="Shetland Sheepdog">Shetland Sheepdog</option>
            <option value="Shiba Inu">Shiba Inu</option>
            <option value="Shih Tzu">Shih Tzu</option>
            <option value="Siberian Husky">Siberian Husky</option>
            <option value="Yorkshire Terrier">Yorkshire Terrier</option>
        </select>
    )
}

export default DogBreedFilter