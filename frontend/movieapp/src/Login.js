import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from './forest.jpg';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      navigate('/welcome');
    } catch (error) {
      console.error('Login error:', error); 
    alert('Login failed. Please try again.');
    }
  };

  return (
    <div 
    style={{ 
      backgroundImage:`url(${backgroundImage})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      height: '100vh',  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center', 
      }}>
    <h1 style={{color:'white', textAlign:'center', padding:'5%'}}>Welcome to Movie Forest</h1>
    <form onSubmit={handleLogin} style={{display:'inline-grid', position:'absolute', top:'10%', right:'5%'}}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ marginBottom: '5px', padding: '5px', width: '150px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <button type="button" onClick={() => navigate('/register')}>Register</button>
    </form>
    </div>
  );
}

export default Login;
