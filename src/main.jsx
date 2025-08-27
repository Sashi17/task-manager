import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your Tailwind base styles
import App from './App';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*
      THE FIX: We wrap the ENTIRE App in the providers here.
      The order is important since TaskProvider uses AuthProvider.
    */}
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <App />
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);