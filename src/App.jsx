import React, { useContext, useEffect } from 'react'; // <-- Import useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDetails from './pages/TaskDetails'; // <-- Make sure to import this

// A component to protect routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  const { theme } = useContext(ThemeContext);

  // THE FIX: This effect runs whenever the theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); // Remove old class
    root.classList.add(theme); // Add new class
  }, [theme]);


  // We no longer need the wrapper div with className={theme}
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;