import React, { useEffect, useState } from 'react';

const InteractiveBackground = () => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrameId;
    
    const handleMove = (e) => {
      setIsHovering(true);
      // Use requestAnimationFrame for smooth performance
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
        if (e.touches && e.touches.length > 0) {
          setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else {
          setPosition({ x: e.clientX, y: e.clientY });
        }
      });
    };

    const handleLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseout', handleLeave);
    window.addEventListener('touchend', handleLeave);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseout', handleLeave);
      window.removeEventListener('touchend', handleLeave);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isHovering ? 1 : 0,
        transition: 'opacity 0.5s ease',
        background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(0, 255, 255, 0.15), transparent 40%)`
      }}
    />
  );
};

export default InteractiveBackground;
