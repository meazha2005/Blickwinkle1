"use client";

import { useEffect, useRef } from "react";

const LOGO_SRCS = [
  "/floatings/facebook.png",
  "/floatings/insta.png",
  "/floatings/linkedin.png",
  "/floatings/mail.png",
  "/floatings/n8n.png",
  "/floatings/website.png",
  "/floatings/whatsapp.png",
];

// Responsive repetitions:
// Phone (< 768px): 2 repetitions (14 logos)
// Tab (768px - 1023px): 3 repetitions (21 logos)
// Laptop & Desktop (>= 1024px): 5 repetitions (35 logos)
function getRepetitions(w: number): number {
  if (w < 768) return 2;
  if (w < 1024) return 3;
  return 5;
}

const LOGO_SIZE = 38; // Uniform square dimension for all logos

interface LogoParticle {
  imgIndex: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  floorY: number;
  size: number;
  isResting: boolean;
}

export default function InteractiveFloatingLogos() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    // Preload all logo images
    const images: HTMLImageElement[] = [];
    LOGO_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
      images.push(img);
    });

    const particles: LogoParticle[] = [];

    // Mouse tracking state
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      isActive: false,
    };

    function initParticles(w: number, h: number) {
      particles.length = 0;
      const reps = getRepetitions(w);
      const total = LOGO_SRCS.length * reps;
      const halfSize = LOGO_SIZE / 2;

      // Distribute slots proportionally across zones so logos never pile or clump:
      const leftCount = Math.max(1, Math.round(total * 0.44));
      const rightCount = Math.max(1, Math.round(total * 0.44));
      const centerCount = Math.max(1, total - leftCount - rightCount);
      const slots: number[] = [];

      // Left zone slots
      const leftStart = 16 + halfSize;
      const leftEnd = Math.max(leftStart + 40, w * 0.35 - halfSize);
      const leftStep = (leftEnd - leftStart) / Math.max(1, leftCount - 1);
      for (let i = 0; i < leftCount; i++) {
        const x = leftStart + i * leftStep + (Math.random() - 0.5) * 8;
        slots.push(Math.max(halfSize + 4, Math.min(w * 0.36, x)));
      }

      // Right zone slots
      const rightStart = Math.min(w - halfSize - 40, w * 0.65 + halfSize);
      const rightEnd = w - 16 - halfSize;
      const rightStep = (rightEnd - rightStart) / Math.max(1, rightCount - 1);
      for (let i = 0; i < rightCount; i++) {
        const x = rightStart + i * rightStep + (Math.random() - 0.5) * 8;
        slots.push(Math.max(w * 0.64, Math.min(w - halfSize - 4, x)));
      }

      // Center slots
      const centerStart = w * 0.40;
      const centerEnd = w * 0.60;
      const centerStep = (centerEnd - centerStart) / Math.max(1, centerCount - 1);
      for (let i = 0; i < centerCount; i++) {
        const x = centerStart + i * centerStep + (Math.random() - 0.5) * 8;
        slots.push(x);
      }

      // Elevated floor on mobile so logos are 100% visible and not hidden under mobile navigation / gesture bar
      const isMobile = w < 768;
      const bottomMargin = isMobile ? 56 : 24;
      const rowGap = isMobile ? 20 : 16;

      for (let i = 0; i < total; i++) {
        const imgIndex = (i * 2 + Math.floor(i / LOGO_SRCS.length)) % LOGO_SRCS.length;
        const targetX = slots[i] || w / 2;

        // Snappy initial cascade: start right above the top boundary so they drop immediately
        const startY = -25 - (i * 8) - Math.random() * 35;

        // Clean resting floor tiers lifted comfortably above screen bottom
        const row = i % 2;
        const floorY = h - halfSize - bottomMargin - row * rowGap;

        particles.push({
          imgIndex,
          x: targetX,
          y: startY,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 3.5 + Math.random() * 2.5, // Brisk initial velocity (snappy drop)
          rotation: (Math.random() - 0.5) * 0.4,
          vr: (Math.random() - 0.5) * 0.02,
          floorY,
          size: LOGO_SIZE,
          isResting: false,
        });
      }
    }

    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      // Cap DPR at 1.5 for ultra-smooth 60fps/120fps on mobile without GPU fill-rate strain
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx?.setTransform(1, 0, 0, 1, 0, 0);
      ctx?.scale(dpr, dpr);

      const halfSize = LOGO_SIZE / 2;
      const expectedTotal = LOGO_SRCS.length * getRepetitions(width);
      const isMobile = width < 768;
      const bottomMargin = isMobile ? 56 : 24;
      const rowGap = isMobile ? 20 : 16;

      if (particles.length === 0 || particles.length !== expectedTotal) {
        initParticles(width, height);
      } else {
        particles.forEach((p, idx) => {
          if (p.x > width - halfSize) p.x = width - halfSize - 10;
          const row = idx % 2;
          p.floorY = height - halfSize - bottomMargin - row * rowGap;
          if (p.isResting) {
            p.y = p.floorY;
          }
        });
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const heroElement = container.parentElement || container;
    let cachedRect = heroElement.getBoundingClientRect();

    const updateRect = () => {
      cachedRect = heroElement.getBoundingClientRect();
    };
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    // Pointer tracking (mouse + touch) using cached bounds to avoid layout thrashing
    const handlePointerMove = (e: PointerEvent) => {
      const newX = e.clientX - cachedRect.left;
      const newY = e.clientY - cachedRect.top;

      if (mouse.isActive) {
        mouse.vx = (newX - mouse.prevX) * 0.5;
        mouse.vy = (newY - mouse.prevY) * 0.5;
      } else {
        mouse.vx = 0;
        mouse.vy = 0;
      }

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = newX;
      mouse.y = newY;
      mouse.isActive = true;
    };

    const handlePointerLeave = () => {
      mouse.isActive = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const handlePointerDown = (e: PointerEvent) => {
      const clickX = e.clientX - cachedRect.left;
      const clickY = e.clientY - cachedRect.top;

      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);
        const radius = 120;

        if (dist < radius) {
          const factor = 1 - dist / radius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * factor * 5.0;
          p.vy -= 5.0 * factor + Math.random() * 2.0;
          p.vr += (Math.random() - 0.5) * 0.15;
          p.isResting = false;
        }
      });
    };

    heroElement.addEventListener("pointermove", handlePointerMove, { passive: true });
    heroElement.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    heroElement.addEventListener("pointerdown", handlePointerDown, { passive: true });

    // Snappy, realistic physics constants: lively drop, smooth settling
    const GRAVITY = 0.52; // Snappy natural gravity (up from sluggish 0.25)
    const AIR_RESISTANCE = 0.985;
    const BOUNCE_RESTITUTION = 0.35;
    const INTERACTION_RADIUS = 90;
    const MAX_VELOCITY = 8.0;

    // Animation Loop
    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      mouse.vx *= 0.82;
      mouse.vy *= 0.82;

      const halfSize = LOGO_SIZE / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor hover repulsion physics
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < INTERACTION_RADIUS && dist > 0) {
            const factor = 1 - dist / INTERACTION_RADIUS;
            const nx = dx / dist;
            const ny = dy / dist;

            const push = factor * 4.5;
            const clampedMouseVx = Math.max(-4, Math.min(4, mouse.vx * 0.2));
            const clampedMouseVy = Math.max(-4, Math.min(4, mouse.vy * 0.2));

            p.vx += nx * push + clampedMouseVx;
            p.vy += ny * (push * 0.5) + clampedMouseVy - factor * 3.5;
            p.vr += (nx * 0.03 + (Math.random() - 0.5) * 0.02) * factor;

            p.vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, p.vx));
            p.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, p.vy));

            p.isResting = false;
          }
        }

        // Physics step
        if (!p.isResting) {
          p.vy += GRAVITY;
          p.vx *= AIR_RESISTANCE;
          p.vy *= AIR_RESISTANCE;
          p.vr *= 0.95;

          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vr;

          // Floor collision and clean settling
          if (p.y >= p.floorY) {
            p.y = p.floorY;

            // Decisive settling: if bounce velocity is small, settle immediately
            if (Math.abs(p.vy) < 1.4) {
              p.vy = 0;
              p.vx *= 0.5;
              if (Math.abs(p.vx) < 0.1) {
                p.vx = 0;
                p.vr = 0;
                p.isResting = true;
              }
            } else {
              p.vy = -p.vy * BOUNCE_RESTITUTION;
              p.vx *= 0.7;
              p.vr *= 0.6;
            }
          }

          // Wall collision
          if (p.x < halfSize) {
            p.x = halfSize;
            p.vx = Math.abs(p.vx) * 0.5;
          } else if (p.x > width - halfSize) {
            p.x = width - halfSize;
            p.vx = -Math.abs(p.vx) * 0.5;
          }

          // Ceiling collision
          if (p.y < halfSize) {
            p.y = halfSize;
            p.vy = Math.abs(p.vy) * 0.5;
          }
        } else {
          // Resting on floor: lock position & ease rotation upright
          p.y = p.floorY;
          p.vy = 0;
          p.vx = 0;
          p.rotation *= 0.90;
        }

        // Render logo without expensive shadowBlur for 60fps/120fps mobile butter smoothness
        const img = images[p.imgIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          if (Math.abs(p.rotation) > 0.005) {
            ctx.rotate(p.rotation);
          }
          ctx.drawImage(img, -halfSize, -halfSize, p.size, p.size);
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
      heroElement.removeEventListener("pointermove", handlePointerMove);
      heroElement.removeEventListener("pointerleave", handlePointerLeave);
      heroElement.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden transform-gpu"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
