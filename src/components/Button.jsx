import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-[var(--radius-full)] font-semibold transition-all duration-300 flex items-center justify-center outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-primary)]';
  
  const variants = {
    primary: 'bg-[var(--grad-primary)] text-white hover:shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-[0.98] border border-transparent',
    secondary: 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] active:scale-[0.98]',
    accent: 'bg-[var(--grad-accent)] text-white hover:shadow-[var(--glow-accent)] hover:scale-[1.02] active:scale-[0.98] border border-transparent',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
