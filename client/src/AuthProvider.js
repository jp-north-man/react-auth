import React, { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({isLoggedIn: false, user: null, token: null});

  const login = (token, user) => {
    setAuth({isLoggedIn: true, user, token});
    console.log(auth);
  };

  const logout = () => {
    setAuth({isLoggedIn: false, user: null, token: null});
    console.log(auth);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
};
