import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ breeds, filters, onFilterChange, onSortChange }) => {
  const [selectedBreeds, setSelectedBreeds] = useState(filters.breeds || []);
  const [ageMin, setAgeMin] = useState(filters.ageMin || '');
  const [ageMax, setAgeMax] = useState(filters.ageMax || '');
  const [searchTerm, setSearchTerm] = useState('');

  const handleBreedToggle = (breed) => {
    let newSelectedBreeds;
   
    if (selectedBreeds.includes(breed)) {
      newSelectedBreeds = selectedBreeds.filter(b => b !== breed);
    } else {
      newSelectedBreeds = [...selectedBreeds, breed];
    }
   
    setSelectedBreeds(newSelectedBreeds);
    onFilterChange({ breeds: newSelectedBreeds });
  };

  const handleAgeChange = () => {
    onFilterChange({ ageMin, ageMax });
  };

  const filteredBreeds = searchTerm
    ? breeds.filter(breed => breed.toLowerCase().includes(searchTerm.toLowerCase()))
    : breeds;

  return (
    <div className="filter-panel">
      <h2>Filter Options</h2>
     
      <div className="filter-section">
        <h3>Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="breed:asc">Breed (A-Z)</option>
          <option value="breed:desc">Breed (Z-A)</option>
          <option value="name:asc">Name (A-Z)</option>
          <option value="name:desc">Name (Z-A)</option>
          <option value="age:asc">Age (Youngest First)</option>
          <option value="age:desc">Age (Oldest First)</option>
        </select>
      </div>
     
      <div className="filter-section">
        <h3>Age Range</h3>
        <div className="age-inputs">
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
            className="age-input"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
            className="age-input"
          />
        </div>
        <button
          onClick={handleAgeChange}
          className="apply-filter-button"
        >
          Apply
        </button>
      </div>
     
      <div className="filter-section breeds-section">
        <h3>Breeds</h3>
        <input
          type="text"
          placeholder="Search breeds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="breed-search"
        />
       
        <div className="breeds-list">
          {filteredBreeds.map(breed => (
            <label key={breed} className="breed-checkbox">
              <input
                type="checkbox"
                checked={selectedBreeds.includes(breed)}
                onChange={() => handleBreedToggle(breed)}
              />
              {breed}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;