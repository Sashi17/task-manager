import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const UserSelector = ({ selected = [], onChange, multiple = false }) => {
  const { users = [] } = useAuth(); // Default to empty array if undefined
  const [selectedUsers, setSelectedUsers] = useState(selected);

  useEffect(() => {
    setSelectedUsers(selected);
  }, [selected]);

  const handleSelect = (userId) => {
    if (multiple) {
      const newSelected = selectedUsers.includes(userId)
        ? selectedUsers.filter(id => id !== userId)
        : [...selectedUsers, userId];
      setSelectedUsers(newSelected);
      onChange(newSelected);
    } else {
      const newSelected = selectedUsers.includes(userId) ? [] : [userId];
      setSelectedUsers(newSelected);
      onChange(newSelected);
    }
  };

  return (
    <div className="space-y-2">
      {users.length > 0 ? (
        users.map(user => (
          <div key={user.id} className="flex items-center">
            <input
              type={multiple ? 'checkbox' : 'radio'}
              id={`user-${user.id}`}
              checked={selectedUsers.includes(user.id)}
              onChange={() => handleSelect(user.id)}
              className="mr-2"
            />
            <label htmlFor={`user-${user.id}`} className="text-gray-700">
              {user.email} ({user.name || 'No Name'})
            </label>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No users available</p>
      )}
    </div>
  );
};

export default UserSelector;