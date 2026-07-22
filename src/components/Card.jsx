import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-[rgba(15,23,42,0.6)] backdrop-blur-xl rounded-[var(--radius-lg)] border border-[rgba(255,255,255,0.1)] shadow-[var(--shadow-subtle)] p-8 ${className}`}
      style={{
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), var(--shadow-subtle)'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
