import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-[var(--color-surface)] rounded-[var(--radius-sm)] border border-[rgba(0,255,255,0.3)] p-8 relative overflow-hidden ${className}`}
      style={{
        boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.05), var(--shadow-subtle)',
      }}
      {...props}
    >
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--color-primary)] opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--color-primary)] opacity-50"></div>
      {children}
    </div>
  );
};

export default Card;
