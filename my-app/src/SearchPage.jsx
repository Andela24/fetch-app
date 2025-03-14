import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import DogCard from './DogCard';
import FilterPanel from './FilterPanel';
import FavoritesList from './FavoritesList';
import MatchResult from './MatchResult';

const SearchPage = ({ userData, setIsAuthenticated }) => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    breeds: [],
    ageMin: '',
    ageMax: '',
    sortBy: 'breed:asc',
    size: 20
  });
  const [matchedDog, setMatchedDog] = useState(null);
  const [showMatchResult, setShowMatchResult] = useState(false);

  useEffect(() => {
    fetchBreeds();
    return () => {
      handleLogout();
    };
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [filters, currentPage]);

  const fetchBreeds = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
        credentials: 'include'
      });
     
      if (!response.ok) {
        throw new Error('Failed to fetch breeds');
      }
     
      const data = await response.json();
      setBreeds(data);
    } catch (err) {
      setError('Error fetching breeds. Please try again.');
      console.error('Breed fetch error:', err);
    }
  };

  const fetchDogs = async (fromCursor = null) => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
     
      if (filters.breeds.length > 0) {
        filters.breeds.forEach(breed => {
          queryParams.append('breeds', breed);
        });
      }
     
      if (filters.ageMin) {
        queryParams.append('ageMin', filters.ageMin);
      }
     
      if (filters.ageMax) {
        queryParams.append('ageMax', filters.ageMax);
      }
     
      queryParams.append('sort', filters.sortBy);
      queryParams.append('size', filters.size);
     
      if (fromCursor) {
        queryParams.append('from', fromCursor);
      }
     
      const searchResponse = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`, {
        credentials: 'include'
      });
     
      if (!searchResponse.ok) {
        throw new Error('Failed to search dogs');
      }
     
      const searchData = await searchResponse.json();
      setTotalResults(searchData.total);
      setNextCursor(searchData.next);
      setPrevCursor(searchData.prev);
     
      const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData.resultIds),
        credentials: 'include'
      });
     
      if (!dogsResponse.ok) {
        throw new Error('Failed to fetch dog details');
      }
     
      const dogsData = await dogsResponse.json();
      setDogs(dogsData);
    } catch (err) {
      setError('Error fetching dogs. Please try again.');
      console.error('Dog fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); 
  };

  const handleSortChange = (sortValue) => {
    setFilters({ ...filters, sortBy: sortValue });
  };

  const toggleFavorite = (dog) => {
    if (favorites.some(fav => fav.id === dog.id)) {
      setFavorites(favorites.filter(fav => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      fetchDogs(nextCursor);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      fetchDogs(prevCursor);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleMatch = async () => {
    if (favorites.length === 0) {
      setError('Please add at least one dog to your favorites to get a match.');
      return;
    }

    setLoading(true);
    setError('');
   
    try {
      const favoriteIds = favorites.map(dog => dog.id);
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favoriteIds),
        credentials: 'include'
      });
     
      if (!response.ok) {
        throw new Error('Failed to find a match');
      }
     
      const matchData = await response.json();
     
      // Fetch the matched dog details
      const matchedDogResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([matchData.match]),
        credentials: 'include'
      });
     
      if (!matchedDogResponse.ok) {
        throw new Error('Failed to fetch matched dog details');
      }
     
      const matchedDogData = await matchedDogResponse.json();
      setMatchedDog(matchedDogData[0]);
      setShowMatchResult(true);
    } catch (err) {
      setError('Error finding a match. Please try again.');
      console.error('Match error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>Fetch Dog Finder</h1>
        <div className="user-info">
          <span>Welcome, {userData.name}!</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
     
      <div className="search-content">
        <FilterPanel
          breeds={breeds}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
       
        <div className="main-content">
          {error && <div className="error-message">{error}</div>}
         
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              <div className="dogs-grid">
                {dogs.map(dog => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                    isFavorite={favorites.some(fav => fav.id === dog.id)}
                    onToggleFavorite={() => toggleFavorite(dog)}
                  />
                ))}
              </div>
             
              <div className="pagination">
                <button
                  onClick={handlePrevPage}
                  disabled={!prevCursor || loading}
                >
                  Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                  onClick={handleNextPage}
                  disabled={!nextCursor || loading}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
       
        <FavoritesList
          favorites={favorites}
          onRemoveFavorite={toggleFavorite}
          onGenerateMatch={handleMatch}
        />
      </div>
     
      {showMatchResult && matchedDog && (
        <MatchResult
          dog={matchedDog}
          onClose={() => setShowMatchResult(false)}
        />
      )}
    </div>
  );
};

export default SearchPage;
