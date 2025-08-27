import React from 'react';

const Button = ({ onClick, children, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
);

export default Button;