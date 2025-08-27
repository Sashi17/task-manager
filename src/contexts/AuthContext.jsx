import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUsers, saveUsers, getCurrentUser, saveCurrentUser } from '../services/storage.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(getUsers() || []);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    console.log('Users updated:', users); // Debug log
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  const register = (email, password, name = '') => {
    if (users.find(u => u.email === email)) {
      alert('User already exists');
      return false;
    }
    const newUser = { id: users.length + 1, email, password, name, profile: {} };
    setUsers([...users, newUser]);
    return true;
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    alert('Invalid credentials');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (profile) => {
    setCurrentUser({ ...currentUser, profile });
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);