import React from 'react';

/**
 * Sci-Fi Tech Corner Brackets Component
 * Adds futuristic cybernetic framing around cards and containers
 */
export const TechBracket = ({ 
  color = 'var(--color-primary, #00ffff)', 
  size = 14, 
  strokeWidth = 2,
  showDots = true,
  className = ''
}) => {
  return (
    <div className={`tech-bracket-overlay ${className}`}>
      {/* Top Left */}
      <svg 
        className="tech-bracket-tl" 
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
          className="tech-dot-tl" 
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} 
        />
      )}

      {/* Top Right */}
      <svg 
        className="tech-bracket-tr" 
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
          className="tech-dot-tr" 
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} 
        />
      )}

      {/* Bottom Left */}
      <svg 
        className="tech-bracket-bl" 
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
        className="tech-bracket-br" 
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
