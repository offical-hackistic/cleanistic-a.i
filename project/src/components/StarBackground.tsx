import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export const StarBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = 200;

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800" />
      
      {/* Moving stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${2 + star.speed * 3}s`,
            animationDelay: `${star.speed * 2}s`,
          }}
        />
      ))}
      
      {/* Large glowing stars */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-80" 
           style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-70" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-60" 
           style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-indigo-300 rounded-full animate-pulse opacity-50" 
           style={{ animationDelay: '1.5s' }} />
      
      {/* Shooting stars */}
      <div className="absolute top-1/5 left-0 w-px h-px bg-white opacity-80 animate-shooting-star" />
      <div className="absolute top-2/3 left-1/4 w-px h-px bg-blue-200 opacity-60 animate-shooting-star-delayed" />
      
      {/* Nebula-like background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900/20 via-transparent to-transparent opacity-30" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-blue-900/20 via-transparent to-transparent opacity-40" />
    </div>
  );
};
