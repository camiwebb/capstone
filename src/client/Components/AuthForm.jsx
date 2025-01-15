import React, { useState } from 'react';

const AuthForm = ()=> {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong.');

      console.log('Success:', data);
      if (data.token) localStorage.setItem('token', data.token);
      alert('Authentication successful!');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
        <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            {isSignUp && (
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange}/>
                </div>
            )}
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}/>
            </div>
            <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
        </form>
        <button onClick={toggleAuthMode}>
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
    </div>
  );
};  

export default AuthForm;