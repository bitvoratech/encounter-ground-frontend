import { useId } from "react";

/**
 * An open heaven behind a hero: a golden sunburst and glow from above, a thick bank of golden
 * cloud across the top, more banks rising from below, and motes of light twinkling between.
 * Purely decorative and CSS/SVG-only (see .heaven in globals.css). Put it as the first child of
 * a `relative isolate overflow-hidden` section; it sits behind the content. With reduced motion
 * everything holds still.
 */

type Circle = [cx: number, cy: number, r: number];

// Cumulus clumps along a 1200×240 tile: [x, width, height, peak]. `peak` (0..1) is where along
// the clump its tallest puff sits, so each clump leans one way instead of all being symmetric.
const clumps: [x: number, width: number, height: number, peak: number][] = [
  [0, 270, 120, 0.4],
  [215, 310, 165, 0.58],
  [480, 250, 112, 0.35],
  [665, 330, 180, 0.62],
  [945, 270, 132, 0.45],
  [1130, 250, 118, 0.5],
];

const BASE = 232;

// Few, large, heavily overlapping round puffs whose size swells smoothly to the peak and falls
// away either side (no jitter), plus a "bridge" puff in every dip so the outline reads as one soft,
// rounded cloud and not a row of bumps. Fixed numbers, so server and client render the same.
const circles: Circle[] = clumps.flatMap(([x, width, height, peak]) => {
  const puffs = 6;
  const main = Array.from({ length: puffs }, (_, i) => {
    const t = i / (puffs - 1); // 0..1 across the clump
    const swell = Math.exp(-(((t - peak) / 0.38) ** 2)); // 1 at the peak, easing off either side
    const r = height * (0.3 + 0.4 * swell);
    return [x + width * (0.08 + 0.84 * t), BASE - r * 0.6, r] as Circle;
  });
  const bridges = main.slice(0, -1).map(([cx, , r], i) => {
    const [nx, , nr] = main[i + 1];
    const br = 0.82 * Math.min(r, nr);
    return [(cx + nx) / 2, BASE - br * 0.6, br] as Circle;
  });
  return [...main, ...bridges].map(([cx, cy, r]) => [Math.round(cx), Math.round(cy), Math.round(r)] as Circle);
});

// Each strip is made of identical tiles. The tile's shapes are drawn once (in <defs>) and every
// tile just <use>s them, so a strip is a handful of nodes instead of hundreds of circles.
function Tile({ href, fill }: { href: string; fill: string }) {
  return (
    <svg viewBox="0 0 1200 240" className="h-full w-auto shrink-0 overflow-visible" focusable="false">
      <use href={href} fill={fill} />
    </svg>
  );
}

// Each strip holds two identical halves, so sliding it left by half its width loops without a
// seam. Three tiles per half keep the screen covered up to very wide monitors.
function Strip({ className, href, fill }: { className: string; href: string; fill: string }) {
  return (
    <div className={`heaven-strip ${className}`}>
      {Array.from({ length: 6 }, (_, i) => (
        <Tile key={i} href={href} fill={fill} />
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
  const tile = `${id}-tile`;
  const clip = `${id}-clip`;

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
          {/* Puffs may rise above the tile, but are cut flat along the base */}
          <clipPath id={clip}>
            <rect x="-100" y="-120" width="1400" height="360" />
          </clipPath>
          <g id={tile} clipPath={`url(#${clip})`}>
            {circles.map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} />
            ))}
            <rect x="-40" y="204" width="1280" height="36" />
          </g>
        </defs>
      </svg>

      {/* <div className="heaven-glow" />
      <div className="heaven-rays" />
      <div className="heaven-sun" /> */}

      <Strip className="heaven-strip-top-back" href={`#${tile}`} fill={`url(#${gold})`} />
      <Strip className="heaven-strip-top" href={`#${tile}`} fill={`url(#${bright})`} />
      <Strip className="heaven-strip-far" href={`#${tile}`} fill={`url(#${gold})`} />
      <Strip className="heaven-strip-near" href={`#${tile}`} fill={`url(#${bright})`} />

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