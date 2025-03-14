import React from 'react';
import './FavoritesList.css';

const FavoritesList = ({ favorites, onRemoveFavorite, onGenerateMatch }) => {
  return (
    <div className="favorites-panel">
      <h2>My Favorites ({favorites.length})</h2>
     
      {favorites.length === 0 ? (
        <p className="no-favorites">Add dogs to your favorites to generate a match!</p>
      ) : (
        <>
          <div className="favorites-list">
            {favorites.map(dog => (
              <div key={dog.id} className="favorite-item">
                <img
                  src={dog.img}
                  alt={dog.name}
                  className="favorite-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/100x100?text=No+Image';
                  }}
                />
                <div className="favorite-info">
                  <h4>{dog.name}</h4>
                  <p>{dog.breed}</p>
                </div>
                <button
                  className="remove-favorite"
                  onClick={() => onRemoveFavorite(dog)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
         
          <button
            className="generate-match-button"
            onClick={onGenerateMatch}
          >
            Find My Match!
          </button>
        </>
      )}
    </div>
  );
};

export default FavoritesList;