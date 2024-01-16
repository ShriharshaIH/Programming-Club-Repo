import React, { useState } from 'react';
import axios from 'axios';
import "./loginComp.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import AdminDashboard from './AdminDashboard';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/register', { username, password });
      alert('User registered successfully!');
      
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/api/login', { username, password });
      alert('Login successful!');
      navigate('/admin-dashboard'); // Use navigate instead of history.push
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="klelogo">
        <img
          src="https://www.mirlabs.org/ias22/images/viewfile.jpg"
          alt="Logo"
          className="logo"
          height="50px"
          width="220px"
        />
      </div>
      <h2>Club Admin Login/Register</h2>
      <h2>Register</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="but" onClick={handleRegister}>Register</button>

      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="but" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;
