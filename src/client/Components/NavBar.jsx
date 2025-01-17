import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

function NavBar() {
  const { authData, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>

        {authData.token ? (
          <>
            <li><Link to="/account">Account</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/sign-up">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
