import { useId } from "react";

/**
 * An open heaven behind a hero: a golden sunburst and glow from above, a thick bank of golden
 * cloud across the top, more banks rising from below, and motes of light twinkling between.
 * Purely decorative and CSS/SVG-only (see .heaven in globals.css). Put it as the first child of
 * a `relative isolate overflow-hidden` section; it sits behind the content. With reduced motion
 * everything holds still.
 */

type Circle = [cx: number, cy: number, r: number];

// Billowing cumulus clumps along a 1200×240 tile: each clump is a flat-bottomed row of puffs,
// tallest in the middle. Fixed numbers (not random) so server and client render the same.
const clumps: [x: number, width: number, height: number][] = [
  [0, 260, 120],
  [210, 300, 160],
  [470, 240, 110],
  [660, 320, 175],
  [940, 260, 130],
  [1140, 260, 120],
];

const circles: Circle[] = clumps.flatMap(([x, width, height]) => {
  const base = 230;
  const puffs = 6;
  return Array.from({ length: puffs }, (_, i) => {
    const t = (i + 0.5) / puffs; // 0..1 across the clump
    const lift = Math.sin(Math.PI * t); // tallest in the middle
    const r = height * (0.32 + 0.38 * lift) * (i % 2 ? 0.92 : 1);
    return [Math.round(x + width * t), Math.round(base - r * 0.55 - height * 0.35 * lift), Math.round(r)] as Circle;
  });
});

function Tile({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 1200 240" className="h-full w-auto shrink-0 overflow-visible" focusable="false" fill={fill}>
      {circles.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
      <rect x="-40" y="200" width="1280" height="40" />
    </svg>
  );
}

// Each strip holds two identical halves, so sliding it left by half its width loops without a
// seam. Three tiles per half keep the screen covered up to very wide monitors.
function Strip({ className, fill }: { className: string; fill: string }) {
  return (
    <div className={`heaven-strip ${className}`}>
      {Array.from({ length: 6 }, (_, i) => (
        <Tile key={i} fill={fill} />
      ))}
    </div>
  );
}

// Motes of light: [left %, top %, size px, delay s]. Kept mostly to the edges and the top so they
// stay clear of the text.
const motes: [number, number, number, number][] = [
  [6, 30, 6, 0],
  [14, 62, 4, 1.8],
  [22, 18, 5, 3.1],
  [38, 12, 4, 0.9],
  [48, 26, 7, 2.4],
  [57, 8, 4, 4.2],
  [64, 40, 5, 1.2],
  [72, 16, 6, 3.6],
  [80, 58, 4, 0.4],
  [88, 24, 7, 2.9],
  [94, 46, 5, 1.5],
  [32, 70, 4, 4.8],
  [60, 72, 5, 2.1],
  [96, 12, 4, 3.3],
];

// Cloud colours for each tone: [crown, upper, lower, underside] for the gilded (back) banks and
// [crown, middle, underside] for the bright (front) ones.
const tones = {
  // Cream-white crowns, gilded beneath, as if lit by the glory above (the ministry's gold).
  gold: { back: ["#fffdf6", "#fff1c9", "#f6cf6e", "#e8b23f"], front: ["#ffffff", "#fff6dc", "#f8d98a"] },
  // Bright white over cool silver, matching Beth-El's silver banner.
  silver: { back: ["#ffffff", "#f1f3f6", "#cfd4db", "#aab1bb"], front: ["#ffffff", "#f6f7f9", "#d9dde3"] },
} as const;

export function HeavenClouds({ tone = "gold" }: { tone?: keyof typeof tones }) {
  const { back, front } = tones[tone];
  const id = useId().replace(/:/g, "");
  const gold = `${id}-gold`;
  const bright = `${id}-bright`;

  return (
    <div aria-hidden="true" className={`heaven heaven-${tone}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gold} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="240">
            <stop offset="0" stopColor={back[0]} />
            <stop offset="0.45" stopColor={back[1]} />
            <stop offset="0.8" stopColor={back[2]} />
            <stop offset="1" stopColor={back[3]} />
          </linearGradient>
          <linearGradient id={bright} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="240">
            <stop offset="0" stopColor={front[0]} />
            <stop offset="0.6" stopColor={front[1]} />
            <stop offset="1" stopColor={front[2]} />
          </linearGradient>
        </defs>
      </svg>

      {/* <div className="heaven-glow" />
      <div className="heaven-rays" />
      <div className="heaven-sun" /> */}

      <Strip className="heaven-strip-top-back" fill={`url(#${gold})`} />
      <Strip className="heaven-strip-top" fill={`url(#${bright})`} />
      <Strip className="heaven-strip-far" fill={`url(#${gold})`} />
      <Strip className="heaven-strip-near" fill={`url(#${bright})`} />

      {motes.map(([left, top, size, delay]) => (
        <span
          key={`${left}-${top}`}
          className="heaven-mote"
          style={{ left: `${left}%`, top: `${top}%`, width: size * 1.6, height: size * 1.6, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
