import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string };

const LIFETIME_MS = 1200;
const GRAVITY = 0.0006;

/** Reads the palette from theme tokens so the canvas never hard-codes colours. */
function tokenColors(element: Element): string[] {
  const style = getComputedStyle(element);
  return ['--color-accent', '--color-xp', '--color-focus', '--color-danger']
    .map((name) => style.getPropertyValue(name).trim())
    .filter(Boolean);
}

/** A one-shot confetti burst from the centre. Renders nothing under reduced motion. */
export function ParticleBurst({ count = 80 }: { count?: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const colors = tokenColors(canvas);
    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.45;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.25,
        size: 3 + Math.random() * 5,
        color: colors[i % colors.length] ?? 'currentColor',
      };
    });

    const startedAt = performance.now();
    let last = startedAt;
    let frame = requestAnimationFrame(function draw(time) {
      const dt = time - last;
      last = time;
      const life = (time - startedAt) / LIFETIME_MS;
      context.clearRect(0, 0, width, height);
      context.globalAlpha = Math.max(0, 1 - life);
      for (const p of particles) {
        p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        context.fillStyle = p.color;
        context.fillRect(p.x, p.y, p.size, p.size);
      }
      if (life < 1) frame = requestAnimationFrame(draw);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [count]);

  if (reducedMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="particle-burst"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
