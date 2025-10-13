
import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import the Link component

export const BottomWarning = ({ label, buttonText, to }) => {
  return (
    <div className="py-2 text-sm flex justify-center">
      <div>{label}</div>
      {/* 2. Replace <a> with <Link> and use the 'to' prop directly */}
      <Link className="pointer underline pl-1 cursor-pointer" to={to}>
        {buttonText}
      </Link>
    </div>
  );
};