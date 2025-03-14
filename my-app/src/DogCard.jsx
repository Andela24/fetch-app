import React from 'react';
import './DogCard.css';

const DogCard = ({ dog, isFavorite, onToggleFavorite }) => {
  return (
    <div className="dog-card">
      <div className="dog-image-container">
        <img
          src={dog.img}
          alt={`${dog.name} - ${dog.breed}`}
          className="dog-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x300?text=No+Image';
          }}
        />
        <button
          className={`favorite-button ${isFavorite ? 'favorites' : ''}`}
          onClick={onToggleFavorite}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
     
      <div className="dog-info">
        <h3 className="dog-name">{dog.name}</h3>
        <p className="dog-breed">{dog.breed}</p>
        <p className="dog-age">{dog.age} years old</p>
        <p className="dog-location">Zip: {dog.zip_code}</p>
      </div>
    </div>
  );
};

export default DogCard;