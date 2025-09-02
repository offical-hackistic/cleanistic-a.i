import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  isShootingStar: boolean;
  shootingOffset: number;
}

export const StarBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = 200;

      for (let i = 0; i < starCount; i++) {
        // Make about 15% of stars potential shooting stars
        const isShootingStar = Math.random() < 0.15;
        
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          isShootingStar,
          shootingOffset: Math.random() * 100, // When in scroll they start shooting
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800" />
      
      {/* Moving stars */}
      {stars.map((star) => {
        const isCurrentlyShootingStar = star.isShootingStar && scrollY > star.shootingOffset;
        const shootingDistance = isCurrentlyShootingStar ? Math.min((scrollY - star.shootingOffset) * 0.5, 300) : 0;
        
        return (
          <div
            key={star.id}
            className={`absolute rounded-full bg-white transition-all duration-300 ${
              isCurrentlyShootingStar ? 'shadow-shooting-star' : 'animate-twinkle'
            }`}
            style={{
              left: `${star.x + (isCurrentlyShootingStar ? shootingDistance * 0.3 : 0)}%`,
              top: `${star.y + (isCurrentlyShootingStar ? shootingDistance * 0.2 : 0)}%`,
              width: `${star.size + (isCurrentlyShootingStar ? 2 : 0)}px`,
              height: `${star.size + (isCurrentlyShootingStar ? 2 : 0)}px`,
              opacity: isCurrentlyShootingStar ? Math.max(star.opacity - shootingDistance * 0.01, 0.1) : star.opacity,
              animationDuration: isCurrentlyShootingStar ? '0.5s' : `${2 + star.speed * 3}s`,
              animationDelay: isCurrentlyShootingStar ? '0s' : `${star.speed * 2}s`,
              boxShadow: isCurrentlyShootingStar 
                ? `0 0 ${6 + shootingDistance * 0.1}px rgba(255, 255, 255, 0.8), ${shootingDistance * -0.5}px ${shootingDistance * -0.3}px ${shootingDistance * 0.2}px rgba(255, 255, 255, 0.3)`
                : 'none',
              transform: isCurrentlyShootingStar 
                ? `rotate(${Math.atan2(shootingDistance * 0.2, shootingDistance * 0.3) * 180 / Math.PI + 45}deg) scaleX(${1 + shootingDistance * 0.05})`
                : 'none',
            }}
          />
        );
      })}
      
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
      
      {/* Nebula-like background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900/20 via-transparent to-transparent opacity-30" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-blue-900/20 via-transparent to-transparent opacity-40" />
    </div>
  );
};
