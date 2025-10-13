import React from 'react';

export const InputBox = ({ label, placeholder, onChange, type = "text" }) => {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">{label}</div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </div>
  );
};