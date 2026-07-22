import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`ui-btn ui-btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
