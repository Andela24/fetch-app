import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setIsAuthenticated, setUserData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include'
      });

      if (response.ok) {
        setUserData({ name, email });
        setIsAuthenticated(true);
        navigate('/search');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Fetch Dog Finder</h1>
        <h2 className="login-subtitle">Find your perfect furry friend!</h2>
       
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
         
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
         
          {error && <div className="error-message">{error}</div>}
         
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Find Dogs'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;