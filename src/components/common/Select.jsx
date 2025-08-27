import React from 'react';

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange}>
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);

export default Select;