import React from 'react';

export const Input = (props) => {
  return <input {...props} className="border p-2 rounded-md w-full" />;
};

export const Select = ({ children, ...props }) => {
  return (
    <select {...props} className="border p-2 rounded-md w-full">
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};
