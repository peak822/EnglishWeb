import React from 'react';

/**
 * Sci-Fi Tech Corner Brackets Component
 * Adds futuristic cybernetic framing around cards and containers
 */
export const TechBracket = ({ 
  color = 'var(--color-primary, #00ffff)', 
  size = 12, 
  strokeWidth = 2,
  showDots = true,
  className = ''
}) => {
  return (
    <div className={`tech-bracket-overlay pointer-events-none absolute inset-0 z-10 overflow-hidden ${className}`}>
      {/* Top Left */}
      <svg 
        className="absolute top-1 left-1" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M24 2H2V24" 
          stroke={color} 
          strokeWidth={strokeWidth * 2} 
          strokeLinecap="round" 
        />
      </svg>
      {showDots && (
        <span 
          className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full animate-pulse" 
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} 
        />
      )}

      {/* Top Right */}
      <svg 
        className="absolute top-1 right-1" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M0 2H22V24" 
          stroke={color} 
          strokeWidth={strokeWidth * 2} 
          strokeLinecap="round" 
        />
      </svg>
      {showDots && (
        <span 
          className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full animate-pulse" 
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} 
        />
      )}

      {/* Bottom Left */}
      <svg 
        className="absolute bottom-1 left-1" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M24 22H2V0" 
          stroke={color} 
          strokeWidth={strokeWidth * 2} 
          strokeLinecap="round" 
        />
      </svg>

      {/* Bottom Right */}
      <svg 
        className="absolute bottom-1 right-1" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M0 22H22V0" 
          stroke={color} 
          strokeWidth={strokeWidth * 2} 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};

export default TechBracket;
