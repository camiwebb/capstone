import React, { useState } from 'react';

const AuthForm = ()=> {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div>
        <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        <form action="">
            {isSignUp && (
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" />
                </div>
            )}
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" />
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
