import React, { useEffect, useRef, useState } from 'react';

const InteractiveBackground = ({ theme = 'cyberpunk' }) => {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  // Mouse tracking for CSS fallback/base effects
  useEffect(() => {
    let animationFrameId;
    const handleMove = (e) => {
      setIsHovering(true);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (e.touches && e.touches.length > 0) {
          setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else {
          setPosition({ x: e.clientX, y: e.clientY });
        }
      });
    };
    const handleLeave = () => setIsHovering(false);

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

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle system state
    let particles = [];
    const mouse = { x: -1000, y: -1000 };
    
    // Track mouse for canvas specifically (smoother interpolation)
    const handleCanvasMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      } else {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
    };
    window.addEventListener('mousemove', handleCanvasMove);
    window.addEventListener('touchmove', handleCanvasMove);

    // Initialization based on theme
    if (theme === 'cyberpunk') {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: Math.random() * 2 + 1
        });
      }
    } else if (theme === 'meadow-day') {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.5, // float up
          size: Math.random() * 3 + 2,
          wobble: Math.random() * Math.PI * 2
        });
      }
    } else if (theme === 'milky-way') {
      // Comet trail particles will be spawned dynamically in draw loop
    } else if (theme === 'sunset-vaporwave') {
      // Glowing retro triangles
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 30 + 10,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.02,
          vy: Math.random() * 0.5 + 0.2
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (theme === 'cyberpunk') {
        // Draw tech nodes and lines
        ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
        
        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Connect to nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
          
          // Connect to mouse
          const dxMouse = p.x - mouse.x;
          const dyMouse = p.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distMouse < 200) {
            ctx.strokeStyle = `rgba(255, 0, 255, ${1 - distMouse/200})`; // Neon pink laser
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)'; // Reset
          }
        });
      } 
      else if (theme === 'meadow-day') {
        // Draw fireflies / pollen
        particles.forEach(p => {
          p.wobble += 0.05;
          p.x += p.vx + Math.sin(p.wobble) * 0.5;
          p.y += p.vy;
          
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
          
          // Flee from mouse
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            p.x += dx * 0.02;
            p.y += dy * 0.02;
          }
          
          ctx.fillStyle = `rgba(167, 243, 208, ${Math.sin(p.wobble) * 0.5 + 0.5})`; // emerald-200
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(167, 243, 208, 1)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0; // reset
      }
      else if (theme === 'milky-way') {
        // Comet trail
        particles.push({
          x: mouse.x,
          y: mouse.y,
          life: 1,
          size: Math.random() * 4 + 2
        });
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(216, 180, 254, 0.4)'; // purple-300, reduced brightness
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life -= 0.05;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          
          ctx.fillStyle = `rgba(216, 180, 254, ${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      else if (theme === 'sunset-vaporwave') {
        // Glowing Triangles
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.6)'; // orange-400
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(236, 72, 153, 0.8)'; // pink-500
        ctx.lineWidth = 2;
        
        particles.forEach(p => {
          p.rot += p.vRot;
          p.y -= p.vy;
          if (p.y < -50) p.y = canvas.height + 50;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.866, p.size * 0.5);
          ctx.lineTo(-p.size * 0.866, p.size * 0.5);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        });
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleCanvasMove);
      window.removeEventListener('touchmove', handleCanvasMove);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  // Specific CSS backgrounds per theme
  const renderCSSBackground = () => {
    if (theme === 'milky-way') {
      return <div className="stars-layer fixed inset-0 pointer-events-none z-[-2]" />;
    }
    if (theme === 'sunset-vaporwave') {
      return (
        <div className="vaporwave-grid-container fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
          <div className="vaporwave-grid" />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* CSS Ambient Layer */}
      {renderCSSBackground()}
      
      {/* Canvas Particle Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      
      {/* Legacy Radial Glow (used mostly for Cyberpunk/Meadow Day base) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: isHovering && (theme === 'cyberpunk' || theme === 'meadow-day') ? 0.15 : 0,
          transition: 'opacity 0.5s ease',
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, var(--color-primary), transparent 40%)`
        }}
      />
    </>
  );
};

export default InteractiveBackground;
