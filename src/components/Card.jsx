import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`ui-card ${className}`}
      style={{
        boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.05), var(--shadow-subtle)',
      }}
      {...props}
    >
      <div className="ui-card-corner top-left"></div>
      <div className="ui-card-corner bottom-right"></div>
      {children}
    </div>
  );
};

export default Card;
