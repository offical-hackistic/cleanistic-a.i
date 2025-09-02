import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  formed: boolean;
}

interface ParticleAnimationProps {
  text: string;
  className?: string;
  particleCount?: number;
  colors?: string[];
}

export const ParticleAnimation: React.FC<ParticleAnimationProps> = ({
  text,
  className = '',
  particleCount = 200,
  colors = ['#3b82f6', '#10b981', '#8b5cf6']
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const textPositionsRef = useRef<{x: number, y: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate text positions
    const generateTextPositions = () => {
      const positions: {x: number, y: number}[] = [];
      const fontSize = Math.min(canvas.width / text.length * 0.8, 60);
      
      ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const textWidth = ctx.measureText(text).width;
      const startX = (canvas.width / window.devicePixelRatio - textWidth) / 2;
      const centerY = canvas.height / window.devicePixelRatio / 2;

      // Create text path for particles to follow
      ctx.fillText(text, canvas.width / window.devicePixelRatio / 2, centerY);
      
      // Sample pixels from text to create target positions
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];
          
          if (alpha > 128 && positions.length < particleCount) {
            positions.push({
              x: x / window.devicePixelRatio,
              y: y / window.devicePixelRatio
            });
          }
        }
      }

      return positions;
    };

    // Initialize particles
    const initParticles = () => {
      const positions = generateTextPositions();
      textPositionsRef.current = positions;
      
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => {
        const targetPos = positions[i % positions.length] || { x: 0, y: 0 };
        
        return {
          x: Math.random() * canvas.width / window.devicePixelRatio,
          y: Math.random() * canvas.height / window.devicePixelRatio,
          targetX: targetPos.x,
          targetY: targetPos.y,
          vx: 0,
          vy: 0,
          size: Math.random() * 3 + 1,
          opacity: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          formed: false
        };
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      particlesRef.current.forEach(particle => {
        // Calculate force towards target
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 2) {
          // Apply force towards target
          const force = 0.02;
          particle.vx += dx * force;
          particle.vy += dy * force;
          
          // Apply damping
          particle.vx *= 0.95;
          particle.vy *= 0.95;
          
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Fade in as particle approaches target
          particle.opacity = Math.min(1, 1 - distance / 200);
        } else {
          particle.formed = true;
          particle.opacity = 1;
        }
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, particleCount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
};