import React, { useEffect, useRef } from 'react';

const InteractiveBackground = ({ theme = 'cyberpunk' }) => {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  // High-performance pointer tracking for desktop only (direct DOM update, 0 React re-renders)
  useEffect(() => {
    // Only enable mouse ambient glow on non-touch devices with fine pointers
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || !glowRef.current) return;

    let animId;
    const handlePointerMove = (e) => {
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.opacity = (theme === 'cyberpunk' || theme === 'meadow-day') ? '0.15' : '0';
          glowRef.current.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, var(--color-primary), transparent 45%)`;
        }
      });
    };

    const handlePointerLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [theme]);

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId;
    let isVisible = !document.hidden;

    // Detect mobile / low-power screen
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    // Resize handler with DPR
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Particle system state
    const particles = [];
    const mouse = { x: -1000, y: -1000 };

    // Track mouse specifically for canvas on desktop (throttled)
    const handleCanvasMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      } else {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
    };

    const handleCanvasLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleCanvasMove, { passive: true });
    window.addEventListener('mouseleave', handleCanvasLeave);

    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;

    // Mobile-tuned particle counts
    if (theme === 'cyberpunk') {
      const count = isMobile ? 24 : 65;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * logicalWidth,
          y: Math.random() * logicalHeight,
          vx: (Math.random() - 0.5) * (isMobile ? 0.6 : 0.9),
          vy: (Math.random() - 0.5) * (isMobile ? 0.6 : 0.9),
          size: Math.random() * 1.8 + 1
        });
      }
    } else if (theme === 'meadow-day') {
      const count = isMobile ? 20 : 45;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * logicalWidth,
          y: Math.random() * logicalHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.4,
          size: Math.random() * 2.5 + 1.5,
          wobble: Math.random() * Math.PI * 2
        });
      }
    } else if (theme === 'sunset-vaporwave') {
      const count = isMobile ? 10 : 18;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * logicalWidth,
          y: Math.random() * logicalHeight,
          size: Math.random() * 24 + 8,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.015,
          vy: Math.random() * 0.4 + 0.15
        });
      }
    }

    const draw = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (theme === 'cyberpunk') {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.12)';
        const maxDist = isMobile ? 65 : 95;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          else if (p.y > h) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Connect to nearby particles (distance check with squared distance)
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Connect to mouse if nearby (desktop only)
          if (!isMobile && mouse.x > 0) {
            const dxMouse = p.x - mouse.x;
            const dyMouse = p.y - mouse.y;
            const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

            if (distMouseSq < 22500) { // 150px
              const distMouse = Math.sqrt(distMouseSq);
              ctx.strokeStyle = `rgba(255, 0, 255, ${1 - distMouse / 150})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
              ctx.strokeStyle = 'rgba(0, 255, 255, 0.12)';
            }
          }
        }
      } else if (theme === 'meadow-day') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.wobble += 0.04;
          p.x += p.vx + Math.sin(p.wobble) * 0.4;
          p.y += p.vy;

          if (p.y < -10) p.y = h + 10;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;

          ctx.fillStyle = `rgba(167, 243, 208, ${Math.sin(p.wobble) * 0.4 + 0.5})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme === 'milky-way') {
        if (mouse.x > 0 && !isMobile) {
          particles.push({
            x: mouse.x,
            y: mouse.y,
            life: 1,
            size: Math.random() * 3 + 1.5
          });
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life -= 0.05;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `rgba(216, 180, 254, ${p.life * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme === 'sunset-vaporwave') {
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.5)';
        ctx.lineWidth = 1.5;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.rot += p.vRot;
          p.y -= p.vy;
          if (p.y < -50) p.y = h + 50;

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
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleCanvasMove);
      window.removeEventListener('mouseleave', handleCanvasLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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

      {/* High-Performance Radial Glow Layer (Updated via DOM ref, 0 React re-renders) */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </>
  );
};

export default InteractiveBackground;

