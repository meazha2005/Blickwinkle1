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
// Phone (< 768px): 2 repetitions (18 logos)
// Tab (768px - 1023px): 3 repetitions (27 logos)
// Laptop & Desktop (>= 1024px): 5 repetitions (45 logos)
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    // Preload all 9 images
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
      // ~44% left corner, ~44% right corner, remainder in lower center
      const leftCount = Math.max(1, Math.round(total * 0.44));
      const rightCount = Math.max(1, Math.round(total * 0.44));
      const centerCount = Math.max(1, total - leftCount - rightCount);
      const slots: number[] = [];

      // Left zone slots: 16px to w * 0.35
      const leftStart = 16 + halfSize;
      const leftEnd = Math.max(leftStart + 40, w * 0.35 - halfSize);
      const leftStep = (leftEnd - leftStart) / Math.max(1, leftCount - 1);
      for (let i = 0; i < leftCount; i++) {
        const x = leftStart + i * leftStep + (Math.random() - 0.5) * 8;
        slots.push(Math.max(halfSize + 4, Math.min(w * 0.36, x)));
      }

      // Right zone slots: w * 0.65 to w - 16px
      const rightStart = Math.min(w - halfSize - 40, w * 0.65 + halfSize);
      const rightEnd = w - 16 - halfSize;
      const rightStep = (rightEnd - rightStart) / Math.max(1, rightCount - 1);
      for (let i = 0; i < rightCount; i++) {
        const x = rightStart + i * rightStep + (Math.random() - 0.5) * 8;
        slots.push(Math.max(w * 0.64, Math.min(w - halfSize - 4, x)));
      }

      // Center slots: w * 0.40 to w * 0.60
      const centerStart = w * 0.40;
      const centerEnd = w * 0.60;
      const centerStep = (centerEnd - centerStart) / Math.max(1, centerCount - 1);
      for (let i = 0; i < centerCount; i++) {
        const x = centerStart + i * centerStep + (Math.random() - 0.5) * 8;
        slots.push(x);
      }

      for (let i = 0; i < total; i++) {
        // Interleave logo images so identical logos aren't placed side by side
        const imgIndex = (i * 2 + Math.floor(i / LOGO_SRCS.length)) % LOGO_SRCS.length;
        const targetX = slots[i] || w / 2;

        // Staggered cascade drop from above
        const startY = -40 - (i * 14) - Math.random() * 80;

        // Two clean, natural resting floor tiers at the bottom (Row 0: bottom, Row 1: slightly staggered)
        const row = i % 2;
        const floorY = h - halfSize - 8 - row * 16;

        particles.push({
          imgIndex,
          x: targetX,
          y: startY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 2.0 + Math.random() * 2.0,
          rotation: (Math.random() - 0.5) * 0.6,
          vr: (Math.random() - 0.5) * 0.03,
          floorY,
          size: LOGO_SIZE,
          isResting: false,
        });
      }
    }

    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

      if (particles.length === 0 || particles.length !== expectedTotal) {
        initParticles(width, height);
      } else {
        particles.forEach((p, idx) => {
          if (p.x > width - halfSize) p.x = width - halfSize - 10;
          const row = idx % 2;
          p.floorY = height - halfSize - 8 - row * 16;
          if (p.isResting) {
            p.y = p.floorY;
          }
        });
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const heroElement = container.parentElement || container;

    // Pointer tracking (mouse + touch) scoped strictly to hero element
    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

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
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

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

    // Physics constants
    const GRAVITY = 0.25;
    const AIR_RESISTANCE = 0.975;
    const BOUNCE_RESTITUTION = 0.40;
    const INTERACTION_RADIUS = 90;
    const MAX_VELOCITY = 7.0;

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
            p.vy += ny * (push * 0.5) + clampedMouseVy - factor * 3.5; // Natural upward lift
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
            if (Math.abs(p.vy) < 1.1) {
              p.vy = 0;
              p.vx *= 0.6;
              if (Math.abs(p.vx) < 0.1) {
                p.vx = 0;
                p.vr = 0;
                p.isResting = true;
              }
            } else {
              p.vy = -p.vy * BOUNCE_RESTITUTION;
              p.vx *= 0.75;
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
          p.rotation *= 0.92;
        }

        // Render logo
        const img = images[p.imgIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // Crisp floating drop shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
          ctx.shadowBlur = 6;
          ctx.shadowOffsetY = 3;

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
      heroElement.removeEventListener("pointermove", handlePointerMove);
      heroElement.removeEventListener("pointerleave", handlePointerLeave);
      heroElement.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
