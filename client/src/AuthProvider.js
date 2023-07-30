import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({isLoggedIn: false, user: null, token: null});

  const login = (token, user) => {
    setAuth({isLoggedIn: true, user, token});
  };

  const logout = () => {
    setAuth({isLoggedIn: false, user: null, token: null});
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth', { credentials: 'include' });
        if (!response.ok) throw new Error('Not authenticated');

        const data = await response.json();
        login(data.token, data.user);
      } catch (error) {
        console.error(error.message);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
};
