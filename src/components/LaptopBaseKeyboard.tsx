"use client";

import React from "react";

export default function LaptopBaseKeyboard() {
  // Key row definitions with relative weights for realistic keyboard proportions
  const row1Weights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.2];
  const row1Labels = ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "pwr"];

  const row2Weights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.6];
  const row2Labels = ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "del"];

  const row3Weights = [1.35, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25];
  const row3Labels = ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"];

  const row4Weights = [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.65];
  const row4Labels = ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "ret"];

  const row5Weights = [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.1];
  const row5Labels = ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"];

  // Helper to render keys on the standalone keyboard
  const renderKeyRow = (
    xStart: number,
    xEnd: number,
    y: number,
    h: number,
    weights: number[],
    labels: string[],
    fontSize: number = 5.2
  ) => {
    const totalW = xEnd - xStart;
    const numGaps = weights.length - 1;
    const gap = 2.0;
    const availableForKeyWidths = totalW - numGaps * gap;
    const sumWeights = weights.reduce((a, b) => a + b, 0);

    let curX = xStart;
    return weights.map((w, idx) => {
      const keyWidth = (w / sumWeights) * availableForKeyWidths;
      const x = curX;
      curX += keyWidth + gap;

      return (
        <g key={`kb-k-${y}-${idx}`}>
          {/* Key 3D Bottom Edge */}
          <rect
            x={x}
            y={y + 1}
            width={keyWidth}
            height={h}
            rx={2}
            fill="#090d16"
          />
          {/* Keycap Top Face */}
          <rect
            x={x}
            y={y}
            width={keyWidth}
            height={h}
            rx={2}
            fill="url(#keyGrad)"
            stroke="#1e2433"
            strokeWidth={1.1}
          />
          {/* Top Bevel Highlight Line */}
          <line
            x1={x + 1.2}
            y1={y + 0.8}
            x2={x + keyWidth - 1.2}
            y2={y + 0.8}
            stroke="#64748b"
            strokeWidth={0.6}
            strokeOpacity={0.7}
          />
          {/* Key Label */}
          <text
            x={x + keyWidth / 2}
            y={y + h / 2 + (fontSize > 5 ? 1.8 : 1.5)}
            fontSize={fontSize}
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight={600}
            fill="#cbd5e1"
            textAnchor="middle"
            letterSpacing={-0.3}
            className="select-none pointer-events-none"
          >
            {labels[idx]}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative w-full drop-shadow-2xl">
      <svg
        viewBox="0 0 560 162"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block select-none"
      >
        <defs>
          {/* Metallic Stand Gradient */}
          <linearGradient id="standNeckGrad" x1="260" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="standBaseGrad" x1="280" y1="24" x2="280" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="40%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Standalone Keyboard Chassis Gradient */}
          <linearGradient id="kbChassisGrad" x1="235" y1="62" x2="235" y2="148" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="85%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Keycap Gradient */}
          <linearGradient id="keyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Keyboard Recessed Tray */}
          <linearGradient id="kbWellGrad" x1="235" y1="64" x2="235" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a0f1d" />
            <stop offset="100%" stopColor="#151e30" />
          </linearGradient>

          {/* Mouse Gradient */}
          <linearGradient id="mouseBodyGrad" x1="481" y1="84" x2="481" y2="146" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="30%" stopColor="#cbd5e1" />
            <stop offset="85%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="cableGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* =========================================================================
            0. AMBIENT DESK DROP SHADOWS FOR STAND, KEYBOARD, AND MOUSE
            ========================================================================= */}
        {/* Stand Base Shadow */}
        <ellipse cx="280" cy="45" rx="85" ry="6" fill="#0f172a" fillOpacity="0.25" />
        {/* Keyboard Shadow */}
        <ellipse cx="235" cy="151" rx="212" ry="8" fill="#0f172a" fillOpacity="0.22" />
        {/* Mouse Shadow */}
        <ellipse cx="481" cy="147" rx="24" ry="6" fill="#0f172a" fillOpacity="0.25" />

        {/* =========================================================================
            1. MONITOR STAND (PILLAR NECK + BASE PLATE)
            Creates the realistic desktop monitor stand below the screen
            ========================================================================= */}
        {/* Stand Neck / Pillar connecting to bottom of screen */}
        <path
          d="M 264 0 L 296 0 L 293 30 L 267 30 Z"
          fill="url(#standNeckGrad)"
          stroke="#1e2433"
          strokeWidth="2"
        />
        {/* Stand Neck Specular Highlight Line */}
        <line x1="280" y1="0" x2="280" y2="30" stroke="#cbd5e1" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Stand Base Plate (Resting on the desk) */}
        {/* Base Plate 3D Bottom Thickness */}
        <path
          d="M 194 38 L 194 43 Q 194 46 202 46 L 358 46 Q 366 46 366 43 L 366 38 Z"
          fill="#1e2433"
        />
        {/* Base Plate Top Surface */}
        <path
          d="M 204 26 L 356 26 Q 364 26 365 29 L 366 39 L 194 39 L 195 29 Q 196 26 204 26 Z"
          fill="url(#standBaseGrad)"
          stroke="#1e2433"
          strokeWidth="2"
        />
        {/* Base Plate Bevel Edge */}
        <line x1="198" y1="38" x2="362" y2="38" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />

        {/* =========================================================================
            2. WIRED CABLES (CONNECTING KEYBOARD AND MOUSE TO MONITOR/PC)
            ========================================================================= */}
        {/* Keyboard Cable: smooth curve from keyboard back edge to monitor stand */}
        <path
          d="M 235 62 C 235 48, 260 48, 272 38"
          stroke="url(#cableGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 235 62 C 235 48, 260 48, 272 38"
          stroke="#64748b"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.6"
        />
        {/* Keyboard Cable Strain Relief Boot */}
        <rect x="231" y="60" width="8" height="4" rx="1.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />

        {/* Mouse Cable: smooth flowing S-curve from mouse front to monitor stand */}
        <path
          d="M 481 85 C 481 54, 380 50, 288 38"
          stroke="url(#cableGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 481 85 C 481 54, 380 50, 288 38"
          stroke="#64748b"
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.6"
        />
        {/* Mouse Cable Strain Relief Boot */}
        <rect x="477.5" y="83" width="7" height="4" rx="1" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />

        {/* =========================================================================
            3. STANDALONE WIRED DESKTOP KEYBOARD (NO TOUCHPAD!)
            Roomy, beveled chassis with rubber feet and full key rows
            ========================================================================= */}
        {/* Keyboard Chassis Bottom Edge / 3D Thickness */}
        <path
          d="M 24 140 L 24 147 Q 24 150 32 150 L 438 150 Q 446 150 446 147 L 446 140 Z"
          fill="#1e2433"
        />

        {/* Keyboard Chassis Top Body */}
        <path
          d="M 38 62 L 432 62 Q 442 62 444 67 L 446 141 L 24 141 L 26 67 Q 28 62 38 62 Z"
          fill="url(#kbChassisGrad)"
          stroke="#1e2433"
          strokeWidth="2.5"
        />

        {/* Keyboard Bevel Accent */}
        <path
          d="M 32 141 L 438 141 L 436 145 L 34 145 Z"
          fill="#cbd5e1"
          stroke="#1e2433"
          strokeWidth="0.8"
        />

        {/* Recessed Keyboard Key Well */}
        <path
          d="M 41 65 L 429 65 Q 433 65 434 68 L 441 133 Q 442 135 439 135 L 31 135 Q 28 135 29 133 L 36 68 Q 37 65 41 65 Z"
          fill="url(#kbWellGrad)"
          stroke="#1e2433"
          strokeWidth="1.8"
        />
        <line x1="42" y1="66.5" x2="428" y2="66.5" stroke="#334155" strokeWidth="1" strokeOpacity="0.8" />

        {/* ROW 1: Function row */}
        {renderKeyRow(42, 428, 67, 7.5, row1Weights, row1Labels, 4.8)}

        {/* ROW 2: Number row */}
        {renderKeyRow(39, 431, 77.5, 8.5, row2Weights, row2Labels, 5.5)}

        {/* ROW 3: QWERTY row */}
        {renderKeyRow(36, 434, 89, 9, row3Weights, row3Labels, 5.5)}

        {/* ROW 4: Home row */}
        {renderKeyRow(33, 437, 101, 9, row4Weights, row4Labels, 5.5)}

        {/* ROW 5: Shift row */}
        {renderKeyRow(30, 440, 113, 9.5, row5Weights, row5Labels, 5.2)}

        {/* ROW 6: Modifiers & Wide Centered Spacebar */}
        <g>
          {/* Left Modifiers */}
          {[
            { label: "ctrl", w: 30.5, x: 28.0 },
            { label: "fn", w: 24.9, x: 60.5 },
            { label: "cmd", w: 27.7, x: 87.4 },
            { label: "alt", w: 30.5, x: 117.1 },
          ].map((key, i) => (
            <g key={`kb-r6-l-${i}`}>
              <rect x={key.x} y={126} width={key.w} height={10} rx={2} fill="#090d16" />
              <rect x={key.x} y={125} width={key.w} height={10} rx={2} fill="url(#keyGrad)" stroke="#1e2433" strokeWidth={1.1} />
              <line x1={key.x + 1.2} y1={125.8} x2={key.x + key.w - 1.2} y2={125.8} stroke="#64748b" strokeWidth={0.6} strokeOpacity={0.7} />
              <text x={key.x + key.w / 2} y={131.8} fontSize={4.8} fontFamily="system-ui, sans-serif" fontWeight={600} fill="#cbd5e1" textAnchor="middle">
                {key.label}
              </text>
            </g>
          ))}

          {/* Centered Wide Spacebar */}
          <g>
            <rect x={149.5} y={126} width={155.1} height={10} rx={2.5} fill="#090d16" />
            <rect x={149.5} y={125} width={155.1} height={10} rx={2.5} fill="url(#keyGrad)" stroke="#1e2433" strokeWidth={1.1} />
            <line x1={152} y1={125.8} x2={302} y2={125.8} stroke="#64748b" strokeWidth={0.6} strokeOpacity={0.7} />
          </g>

          {/* Right Modifiers */}
          {[
            { label: "alt", w: 30.5, x: 306.6 },
            { label: "ctrl", w: 30.5, x: 339.1 },
          ].map((key, i) => (
            <g key={`kb-r6-r-${i}`}>
              <rect x={key.x} y={126} width={key.w} height={10} rx={2} fill="#090d16" />
              <rect x={key.x} y={125} width={key.w} height={10} rx={2} fill="url(#keyGrad)" stroke="#1e2433" strokeWidth={1.1} />
              <line x1={key.x + 1.2} y1={125.8} x2={key.x + key.w - 1.2} y2={125.8} stroke="#64748b" strokeWidth={0.6} strokeOpacity={0.7} />
              <text x={key.x + key.w / 2} y={131.8} fontSize={4.8} fontFamily="system-ui, sans-serif" fontWeight={600} fill="#cbd5e1" textAnchor="middle">
                {key.label}
              </text>
            </g>
          ))}

          {/* Dedicated Arrow Keys Cluster */}
          {/* Left Arrow */}
          <g>
            <rect x={371.5} y={126} width={22.2} height={10} rx={2} fill="#090d16" />
            <rect x={371.5} y={125} width={22.2} height={10} rx={2} fill="url(#keyGrad)" stroke="#1e2433" strokeWidth={1.1} />
            <text x={382.6} y={132} fontSize={6.5} fontFamily="system-ui, sans-serif" fontWeight={700} fill="#cbd5e1" textAnchor="middle">
              ◀
            </text>
          </g>

          {/* Up / Down Split Arrow */}
          <g>
            {/* Up arrow */}
            <rect x={395.7} y={125.6} width={22.2} height={4.6} rx={1.5} fill="#090d16" />
            <rect x={395.7} y={125} width={22.2} height={4.6} rx={1.5} fill="url(#keyGrad)" stroke="#1e2433" strokeWidth={1} />
            <text x={406.8} y={128.8} fontSize={4.2} fontFamily="system-ui, sans-serif" fontWeight={700} fill="#cbd5e1" textAnchor="middle">
              ▲
            </text>
            {/* Down arrow */}
            <rect x={395.7} y={130.6} width={22.2} height={4.6} rx={1.5} fill="#090d16" />
            <rect x={395.7} y={130} width={22.2} height={4.6} rx={1.5} fill="url(#keyGrad)" stroke="#1e2433" strokeWidth={1} />
            <text x={406.8} y={133.8} fontSize={4.2} fontFamily="system-ui, sans-serif" fontWeight={700} fill="#cbd5e1" textAnchor="middle">
              ▼
            </text>
          </g>

          {/* Right Arrow */}
          <g>
            <rect x={419.8} y={126} width={22.2} height={10} rx={2} fill="#090d16" />
            <rect x={419.8} y={125} width={22.2} height={10} rx={2} fill="url(#keyGrad)" stroke="#1e2433" strokeWidth={1.1} />
            <text x={430.9} y={132} fontSize={6.5} fontFamily="system-ui, sans-serif" fontWeight={700} fill="#cbd5e1" textAnchor="middle">
              ▶
            </text>
          </g>
        </g>

        {/* =========================================================================
            4. WIRED ERGONOMIC DESKTOP MOUSE (ON THE RIGHT)
            Left/Right click buttons, clickable rubber scroll wheel, specular curve
            ========================================================================= */}
        <g>
          {/* Mouse 3D Base Thickness */}
          <path
            d="M 460 134 Q 458 144 481 146 Q 504 144 502 134 Z"
            fill="#1e2433"
          />

          {/* Mouse Ergonomic Body */}
          <path
            d="M 467 85 Q 481 83 495 85 Q 504 100 503 126 Q 501 144 481 144 Q 461 144 459 126 Q 458 100 467 85 Z"
            fill="url(#mouseBodyGrad)"
            stroke="#1e2433"
            strokeWidth="2.2"
          />

          {/* Left / Right Button Split Line */}
          <line x1="481" y1="85" x2="481" y2="108" stroke="#1e2433" strokeWidth="1.5" />

          {/* Center Scroll Wheel Well */}
          <rect x="477.5" y="90" width="7" height="15" rx="3.5" fill="#1e2433" />
          {/* Center Scroll Wheel (Rubber textured) */}
          <rect x="478.5" y="91" width="5" height="13" rx="2.5" fill="#475569" stroke="#0f172a" strokeWidth="0.8" />
          <line x1="479" y1="94" x2="483" y2="94" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="479" y1="97" x2="483" y2="97" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="479" y1="100" x2="483" y2="100" stroke="#94a3b8" strokeWidth="0.8" />

          {/* Specular Palm Highlight */}
          <path
            d="M 466 98 Q 470 120 478 132"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.45"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
