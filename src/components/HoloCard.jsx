import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import TechBracket from './TechBracket';
import { playCyberSound } from '../utils/cyberSound';

/**
 * HoloCard: 3D Holographic Tilt Card with Cyber Sheen & Audio Interaction
 */
export const HoloCard = ({
  children,
  className = '',
  style = {},
  onClick,
  tiltMaxAngleX = 8,
  tiltMaxAngleY = 8,
  glareEnable = true,
  glareMaxOpacity = 0.25,
  glareColor = '#00ffff',
  bracketColor = 'var(--color-primary, #00ffff)',
  showBrackets = true,
  playSoundOnHover = true,
  playSoundOnClick = true,
  disabled = false,
  ...props
}) => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
  }, []);

  const handleMouseEnter = () => {
    if (playSoundOnHover && !disabled) {
      playCyberSound('hover');
    }
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (playSoundOnClick) {
      playCyberSound('click');
    }
    if (onClick) {
      onClick(e);
    }
  };

  const cardContent = (
    <div
      className={`holo-card-inner relative overflow-hidden rounded-lg transition-all duration-300 ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {showBrackets && <TechBracket color={bracketColor} size={14} />}
      {/* Iridescent Holographic Sheen Layer */}
      <div className="holo-foil-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </div>
  );

  if (isTouch || disabled) {
    return (
      <div className="holo-card-wrapper group relative">
        {cardContent}
      </div>
    );
  }

  return (
    <Tilt
      tiltMaxAngleX={tiltMaxAngleX}
      tiltMaxAngleY={tiltMaxAngleY}
      glareEnable={glareEnable}
      glareMaxOpacity={glareMaxOpacity}
      glareColor={glareColor}
      glarePosition="all"
      glareBorderRadius="8px"
      scale={1.02}
      transitionSpeed={400}
      className="holo-card-wrapper group relative cursor-pointer"
    >
      {cardContent}
    </Tilt>
  );
};

export default HoloCard;
