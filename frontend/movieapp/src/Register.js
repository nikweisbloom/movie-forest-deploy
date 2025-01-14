import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true when the request starts
    setErrorMessage(''); // Reset error message before each submission

    try {
      // Send registration request
      await axios.post('http://localhost:5000/register', { username, password });
      alert('Registration successful! You can now log in.');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      
      // Check if backend sends error message (e.g., username already taken)
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMessage(message); // Set error message to display
    } finally {
      setIsLoading(false); // Reset loading state after request finishes
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister} style={{ width: '300px', margin: '0 auto' }}>
        <h2>Register</h2>

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px' }}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {errorMessage && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{errorMessage}</p>
        )}
      </form>
    </div>
  );
}

export default Register;
