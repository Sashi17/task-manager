import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const UserSelector = ({ selected, onChange, multiple = false }) => {
  const { users, currentUser } = useAuth();
  const availableUsers = users.filter(u => u.id !== currentUser.id); // Exclude self

  const handleChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    onChange(multiple ? value : value[0]);
  };

  return (
    <select multiple={multiple} value={selected} onChange={handleChange}>
      {availableUsers.map(user => (
        <option key={user.id} value={user.id}>{user.email}</option>
      ))}
    </select>
  );
};

export default UserSelector;