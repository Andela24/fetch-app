import React from 'react';
import './MatchResult.css';

const MatchResult = ({ dog, onClose }) => {
  return (
    <div className="match-overlay">
      <div className="match-modal">
        <button className="close-button" onClick={onClose}>✕</button>
       
        <div className="match-content">
          <h2>Congratulations! You've been matched with:</h2>
         
          <div className="matched-dog">
            <div className="matched-dog-image">
              <img
                src={dog.img}
                alt={dog.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x400?text=No+Image';
                }}
              />
            </div>
           
            <div className="matched-dog-info">
              <h3>{dog.name}</h3>
              <p className="match-breed">{dog.breed}</p>
              <p className="match-age">{dog.age} years old</p>
              <p className="match-location">Location: {dog.zip_code}</p>
              <p className="match-message">
                This furry friend is looking forward to meeting you! Contact the shelter using the ID: <strong>{dog.id}</strong> to start the adoption process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResult;