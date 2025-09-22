import { useEffect, useRef } from 'react';

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hub: boolean;
};

export const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      canvas.style.width = clientWidth + 'px';
      canvas.style.height = clientHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    let width = container.clientWidth;
    let height = container.clientHeight;

    const onResize = () => {
      resize();
      width = container.clientWidth;
      height = container.clientHeight;
    };

    window.addEventListener('resize', onResize);

    // Create nodes
    const nodeCount = Math.min(160, Math.floor((width * height) / 9000));
    const nodes: NodePoint[] = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.6,
      hub: i % Math.floor(12 + Math.random() * 8) === 0,
    }));

    // Mouse node (attractor)
    const mouse = { x: width / 2, y: height / 2, active: false };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onMouseLeave = () => { mouse.active = false; };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    const maxLinkDist = 140;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxLinkDist) {
            const t = 1 - dist / maxLinkDist;
            ctx.globalAlpha = 0.12 + t * 0.25;
            ctx.strokeStyle = a.hub || b.hub ? 'rgba(59,130,246,0.5)' : 'rgba(148,163,184,0.45)'; // blue-500 or slate-400
            ctx.lineWidth = 0.6 + t * (a.hub || b.hub ? 1.2 : 0.8);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Links to mouse
        if (mouse.active) {
          const dxm = a.x - mouse.x;
          const dym = a.y - mouse.y;
          const distm = Math.hypot(dxm, dym);
          const near = Math.min(maxLinkDist * 0.9, 120);
          if (distm < near) {
            const t = 1 - distm / near;
            ctx.globalAlpha = 0.1 + t * 0.3;
            ctx.strokeStyle = 'rgba(99,102,241,0.55)'; // indigo-500
            ctx.lineWidth = 0.5 + t * 1.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      // Nodes
      for (const n of nodes) {
        ctx.fillStyle = n.hub ? 'rgba(59,130,246,0.9)' : 'rgba(226,232,240,0.9)'; // blue-500 or slate-200
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.hub ? n.r + 0.8 : n.r, 0, Math.PI * 2);
        ctx.fill();

        if (n.hub) {
          ctx.fillStyle = 'rgba(59,130,246,0.2)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, (n.r + 0.8) * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x <= 0 || n.x >= width) n.vx *= -1;
        if (n.y <= 0 || n.y >= height) n.vy *= -1;
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
