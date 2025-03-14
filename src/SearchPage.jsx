import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import DogCard from './DogCard.jsx';
import FilterPanel from './FilterPanel.jsx';
import FavoritesList from './FavoritesList.jsx';
import MatchResult from './MatchResult.jsx';

const SearchPage = ({ userData, setIsAuthenticated }) => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading
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

  // Only one useEffect for initial setup
  useEffect(() => {
    // Check authentication and fetch initial data
    const initializeData = async () => {
      try {
        // Initial request to verify auth status
        const breedsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include'
        });
        
        if (breedsResponse.status === 401) {
          console.log('Authentication failed - redirecting to login');
          setError('Your session has expired. Please log in again.');
          setIsAuthenticated(false);
          return;
        }
        
        if (!breedsResponse.ok) {
          throw new Error('Failed to fetch breeds');
        }
        
        const breedsData = await breedsResponse.json();
        setBreeds(breedsData);
        
        // Now that we know authentication is valid, fetch dogs
        await fetchDogsInternal();
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Error initializing the application. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
    
    // No cleanup function to prevent logout errors
  }, []);

  // Internal function to fetch dogs - not directly called from useEffect
  const fetchDogsInternal = async (fromCursor = null) => {
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
      
      if (searchResponse.status === 401) {
        setError('Your session has expired. Please log in again.');
        setIsAuthenticated(false);
        return;
      }
      
      if (!searchResponse.ok) {
        throw new Error('Failed to search dogs');
      }
      
      const searchData = await searchResponse.json();
      
      if (!searchData.resultIds || searchData.resultIds.length === 0) {
        setDogs([]);
        setTotalResults(0);
        setNextCursor(null);
        setPrevCursor(null);
        setLoading(false);
        return;
      }
      
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
      
      if (dogsResponse.status === 401) {
        setError('Your session has expired. Please log in again.');
        setIsAuthenticated(false);
        return;
      }
      
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

  // Expose a public version of fetchDogs for event handlers
  const fetchDogs = (fromCursor = null) => {
    fetchDogsInternal(fromCursor);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
    // Use setTimeout to ensure state is updated before fetching
    setTimeout(() => fetchDogsInternal(), 0);
  };

  const handleSortChange = (sortValue) => {
    setFilters({ ...filters, sortBy: sortValue });
    // Use setTimeout to ensure state is updated before fetching
    setTimeout(() => fetchDogsInternal(), 0);
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
      
      // Always set authentication to false, even if the request fails
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
      // Still log out even on error
      setIsAuthenticated(false);
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      fetchDogsInternal(nextCursor);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      fetchDogsInternal(prevCursor);
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
      
      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        setIsAuthenticated(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to find a match');
      }
      
      const matchData = await response.json();
      
      const matchedDogResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([matchData.match]),
        credentials: 'include'
      });
      
      if (matchedDogResponse.status === 401) {
        setError('Your session has expired. Please log in again.');
        setIsAuthenticated(false);
        return;
      }
      
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
          ) : dogs.length === 0 ? (
            <div className="no-results">
              <p>No dogs found matching your criteria. Try adjusting your filters.</p>
            </div>
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