import React from 'react';

const Header = ({ onAddClick }) => {
  const username = 'Gulshan'; // Replace with dynamic user data from AuthContext

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-lg">Task Manager 365</div>
      <div className="flex items-center space-x-4">
        <span className="text-white">{username}</span>
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>
    </header>
  );
};

export default Header;