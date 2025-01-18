import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function AuthForm({ type }) {
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const isRegister = type === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const body = isRegister 
      ? { username, email, password, name } 
      : { username, password };

    try {
      const response = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        navigate('/');
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      {isRegister && (
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {isRegister && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      )}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
    </form>
  );
}

export default AuthForm;