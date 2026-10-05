"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LOGOS = [
  { name: "Instagram", src: "/floatings/insta.png" },
  { name: "Facebook", src: "/floatings/facebook.png" },
  { name: "WhatsApp", src: "/floatings/whatsapp.png" },
  { name: "LinkedIn", src: "/floatings/linkedin.png" },
  { name: "Website", src: "/floatings/website.png" },
  { name: "Mail", src: "/floatings/mail.png" },
  { name: "n8n", src: "/floatings/n8n.png" },
  { name: "Python", src: "/floatings/python.png" },
  { name: "JavaScript", src: "/floatings/js.png" },
];

/**
 * Mobile and Tablet visual accent:
 * A large circular orbital arc anchored at the right side of the screen
 * with ONLY the left half-circle visible.
 * Logos rotate along the arc, starting BIG at the top beginning,
 * and gradually decreasing in size as they travel downwards along the curve.
 * Maintained strictly at 30% opacity and hidden on laptop/desktop (lg:hidden).
 */
export default function MobileTabletHeroAccent() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [dimensions, setDimensions] = useState({ w: 290, h: 570 });

  useEffect(() => {
    let animId = 0;
    const count = LOGOS.length; // 9 logos

    const updateDims = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ w: rect.width, h: rect.height });
      }
    };

    updateDims();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      ro = new ResizeObserver(() => updateDims());
      ro.observe(containerRef.current);
    }
    window.addEventListener("resize", updateDims);

    const loop = (time: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Center of the circle is anchored on the right border, vertically centered
      const centerX = w;
      const centerY = h / 2;

      // Balanced medium circle radius: ~235px-275px
      const radiusY = Math.max(170, Math.min(270, h / 2 - 48));
      const radiusX = Math.max(160, Math.min(radiusY, w - 38));

      // Smooth rotation: 1 full cycle every 20 seconds
      const angle = (time * 0.00032) % (Math.PI * 2);

      for (let i = 0; i < count; i++) {
        const el = itemsRef.current[i];
        if (!el) continue;

        // Angle for each logo spaced around the 360 circle
        const theta = angle + (i * Math.PI * 2) / count;

        // X and Y positions:
        // When cos(theta) > 0, x enters into the screen towards the left
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        const x = centerX - cosTheta * radiusX;
        const y = centerY + sinTheta * radiusY;

        // Visible on the left half-circle (entering into the screen)
        if (cosTheta >= -0.05) {
          // Progress along the arc from top (sinTheta = -1 -> 0) to bottom (sinTheta = 1 -> 1)
          const progress = Math.max(0, Math.min(1, (sinTheta + 1) / 2));

          // Extra big at the top beginning (~2.05x), gradually decreasing to small at the bottom (~0.60x)
          const scale = 2.05 - progress * 1.45;
          const zIndex = Math.round((1 - progress) * 30) + 1;

          // Smooth edge fade as logos enter at the top edge and exit at the bottom edge
          const edgeFade = cosTheta < 0.15 ? Math.max(0, cosTheta / 0.15) : 1;
          const opacity = Math.max(0, Math.min(1, edgeFade));

          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(2)})`;
          el.style.zIndex = `${zIndex}`;
          el.style.opacity = `${opacity.toFixed(2)}`;
          el.style.visibility = "visible";
        } else {
          // Offscreen (hidden on the other half of the circle)
          el.style.opacity = "0";
          el.style.visibility = "hidden";
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateDims);
    };
  }, []);

  const { w, h } = dimensions;
  const centerY = h / 2;
  const radiusY = Math.max(170, Math.min(270, h / 2 - 48));
  const radiusX = Math.max(160, Math.min(radiusY, w - 38));

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 -translate-y-1/2 right-0 w-[290px] sm:w-[390px] md:w-[430px] h-[570px] sm:h-[660px] pointer-events-none opacity-30 select-none block lg:hidden z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        {/* Visible Half-Circle Orbital SVG Arc */}
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full absolute inset-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main primary orbital half-circle arc */}
          <path
            d={`M ${w} ${centerY - radiusY} A ${radiusX} ${radiusY} 0 0 0 ${w} ${centerY + radiusY}`}
            stroke="#0071BC"
            strokeWidth="2.5"
            strokeDasharray="8 8"
            opacity="0.45"
          />
          {/* Inner complementary green half-circle arc */}
          <path
            d={`M ${w} ${centerY - (radiusY - 24)} A ${Math.max(20, radiusX - 24)} ${Math.max(20, radiusY - 24)} 0 0 0 ${w} ${centerY + (radiusY - 24)}`}
            stroke="#39B54A"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            opacity="0.3"
          />
        </svg>

        {/* Logos revolving along the visible half-circle: big at top beginning, gradually small towards bottom */}
        {LOGOS.map((logo, index) => (
          <div
            key={logo.name}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            className="absolute -top-7 -left-7 flex items-center justify-center transition-none"
            style={{
              willChange: "transform, opacity",
            }}
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
