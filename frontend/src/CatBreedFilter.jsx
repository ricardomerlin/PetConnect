function CatBreedFilter({ handleBreedSelection }) {

  return (
    <select className='breed-select' onChange={(e) => handleBreedSelection(e.target.value)}>
      <option value="">Breed...</option>
      <option value="Abyssinian">Abyssinian</option>
      <option value="American Bobtail">American Bobtail</option>
      <option value="American Curl">American Curl</option>
      <option value="American Shorthair">American Shorthair</option>
      <option value="American Wirehair">American Wirehair</option>
      <option value="Balinese">Balinese</option>
      <option value="Bengal">Bengal</option>
      <option value="Birman">Birman</option>
      <option value="Bombay">Bombay</option>
      <option value="British Shorthair">British Shorthair</option>
      <option value="Burmese">Burmese</option>
      <option value="Burmilla">Burmilla</option>
      <option value="Chartreux">Chartreux</option>
      <option value="Cornish Rex">Cornish Rex</option>
      <option value="Domestic Long Hair">Domestic Long Hair</option>
      <option value="Domestic Medium Hair">Domestic Medium Hair</option>
      <option value="Domestic Short Hair">Domestic Short Hair</option>
      <option value="Devon Rex">Devon Rex</option>
      <option value="Egyptian Mau">Egyptian Mau</option>
      <option value="Exotic Shorthair">Exotic Shorthair</option>
      <option value="Himalayan">Himalayan</option>
      <option value="Maine Coon">Maine Coon</option>
      <option value="Manx">Manx</option>
      <option value="Norwegian Forest Cat">Norwegian Forest Cat</option>
      <option value="Oriental">Oriental</option>
      <option value="Persian">Persian</option>
      <option value="Ragdoll">Ragdoll</option>
      <option value="Russian Blue">Russian Blue</option>
      <option value="Scottish Fold">Scottish Fold</option>
      <option value="Siamese">Siamese</option>
      <option value="Siberian">Siberian</option>
      <option value="Singapura">Singapura</option>
      <option value="Somali">Somali</option>
      <option value="Sphynx">Sphynx</option>
      <option value="Tabby">Tabby</option>
      <option value="Tonkinese">Tonkinese</option>
      <option value="Turkish Angora">Turkish Angora</option>
      <option value="Turkish Van">Turkish Van</option>
      <option value="Tuxedo">Tuxedo</option>
    </select>
  );
}

export default CatBreedFilter