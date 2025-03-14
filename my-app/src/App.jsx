import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import SearchPage from './SearchPage.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/search" replace />
              ) : (
                <LoginPage
                  setIsAuthenticated={setIsAuthenticated}
                  setUserData={setUserData}
                />
              )
            }
          />
          <Route
            path="/search"
            element={
              isAuthenticated ? (
                <SearchPage
                  userData={userData}
                  setIsAuthenticated={setIsAuthenticated}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;