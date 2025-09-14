import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';    // ← changed here
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('pfa_token');
    if (!token) return null;
    try {
      return { token, ...jwtDecode(token) };
    } catch { return null; }
  });

  const login = (token, userObj) => {
    localStorage.setItem('pfa_token', token);
    setUser({ token, ...userObj });
  };

  const logout = () => {
    localStorage.removeItem('pfa_token');
    setUser(null);
  };

  // helper to refresh user data from API
  const fetchMe = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(prev => ({ ...prev, profile: res.data }));
    } catch (err) { /* ignore */ }
  };

  useEffect(() => {
    if (user) fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
