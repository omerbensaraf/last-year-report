

import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  warpSpeed?: boolean;
}

export const Background: React.FC<BackgroundProps> = ({ warpSpeed = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Starfield properties
    const stars: { x: number; y: number; z: number }[] = [];
    const numStars = 400;
    
    // Shooting Stars / Asteroids
    const shootingStars: { 
        x: number; y: number; 
        vx: number; vy: number; 
        length: number; 
        size: number;
        life: number; 
        type: 'star' | 'asteroid';
    }[] = [];

    // Base speed
    let speed = 2;
    const targetSpeed = warpSpeed ? 50 : 2;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * width,
      });
    }

    const draw = () => {
      speed += (targetSpeed - speed) * 0.05;

      // Fade background slightly for trails
      ctx.fillStyle = '#05050a'; 
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // --- 1. Grid & Horizon ---
      ctx.beginPath();
      const gridOpacity = Math.max(0.05, 0.15 - (speed - 2) / 100);
      ctx.strokeStyle = `rgba(14, 165, 233, ${gridOpacity})`; 
      ctx.lineWidth = 1;
      
      // Perspective lines
      for (let i = -20; i <= 20; i++) {
         ctx.moveTo(cx + i * 100 * 2, height);
         ctx.lineTo(cx, cy);
         ctx.moveTo(cx + i * 100 * 2, 0);
         ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // Horizontal moving bars
      const offset = (Date.now() * (speed * 25)) % 1000 / 1000; 
      for(let i=0; i<8; i++) {
         const depth = (i + offset) / 8; 
         const yPos = (depth * depth) * (height/2); 
         
         ctx.strokeStyle = `rgba(56, 189, 248, ${depth * 0.15})`;
         ctx.beginPath();
         // Floor
         ctx.moveTo(0, cy + yPos); ctx.lineTo(width, cy + yPos);
         // Ceiling
         ctx.moveTo(0, cy - yPos); ctx.lineTo(width, cy - yPos);
         ctx.stroke();
      }

      // --- 2. Starfield ---
      stars.forEach((star) => {
        star.z -= speed;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width;
          star.y = (Math.random() - 0.5) * height;
        }
        if (star.z > width) star.z = Math.random() * width;

        const k = 256.0 / star.z; 
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0, (1 - star.z / width) * (warpSpeed ? 1 : 2.5));
          const alpha = Math.max(0, Math.min(1, 1 - star.z / width));
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
          
          if (warpSpeed) {
            const len = speed * k * 0.5;
            const angle = Math.atan2(py - cy, px - cx);
            ctx.moveTo(px, py);
            ctx.lineTo(px + Math.cos(angle) * len, py + Math.sin(angle) * len);
            ctx.strokeStyle = `rgba(200, 230, 255, ${alpha})`;
            ctx.lineWidth = size;
            ctx.stroke();
          } else {
             if (size > 0) {
               ctx.arc(px, py, size / 2, 0, Math.PI * 2);
               ctx.fill();
             }
          }
        }
      });

      // --- 3. Shooting Stars / Asteroids ---
      // Spawn logic
      if (!warpSpeed && Math.random() < 0.015) {
          const isAsteroid = Math.random() < 0.2; // 20% chance for asteroid
          shootingStars.push({
              x: Math.random() * width,
              y: Math.random() * (height / 2), // Start in upper half
              vx: (Math.random() - 0.5) * 20 - 10, // Move Left/Right
              vy: Math.random() * 10 + 5, // Move Down
              length: Math.random() * 100 + 50,
              size: isAsteroid ? Math.random() * 3 + 2 : Math.random() * 2,
              life: 1.0,
              type: isAsteroid ? 'asteroid' : 'star'
          });
      }

      // Update & Draw Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.01;

          if (s.life <= 0 || s.x < -100 || s.x > width + 100 || s.y > height + 100) {
              shootingStars.splice(i, 1);
              continue;
          }

          ctx.beginPath();
          if (s.type === 'star') {
             // Trail
             const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 5, s.y - s.vy * 5);
             gradient.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
             gradient.addColorStop(1, 'transparent');
             ctx.strokeStyle = gradient;
             ctx.lineWidth = 2;
             ctx.moveTo(s.x, s.y);
             ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
             ctx.stroke();
             
             // Head
             ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
             ctx.arc(s.x, s.y, 1.5, 0, Math.PI*2);
             ctx.fill();
          } else {
             // Asteroid (Rock)
             ctx.save();
             ctx.translate(s.x, s.y);
             ctx.rotate(Date.now() * 0.005);
             ctx.fillStyle = `rgba(150, 160, 170, ${s.life})`;
             // Draw rough shape
             ctx.beginPath();
             ctx.moveTo(-s.size, -s.size);
             ctx.lineTo(s.size, -s.size*0.5);
             ctx.lineTo(s.size, s.size);
             ctx.lineTo(-s.size*0.5, s.size);
             ctx.closePath();
             ctx.fill();
             // Fire trail for entry?
             ctx.restore();
          }
      }

      // Vignette
      const grad = ctx.createRadialGradient(cx, cy, height/3, cx, cy, height);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(5, 5, 10, 0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [warpSpeed]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="block w-full h-full opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-transparent to-void/90 mix-blend-overlay" />
    </div>
  );
};