import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : { token: null };
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthData({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthData({ token: null });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
