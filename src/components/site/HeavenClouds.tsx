/**
 * A soft sky for a hero: warm light from above, faint rays, and banks of cloud drifting slowly
 * across. Purely decorative and CSS-only (see .heaven in globals.css). Put it as the first child
 * of a `relative isolate overflow-hidden` section; it sits behind the content. With reduced
 * motion the clouds hold still.
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

function Tile() {
  return (
    <svg viewBox="0 0 1200 240" className="h-full w-auto shrink-0" focusable="false">
      {circles.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
      <rect x="-40" y="200" width="1280" height="40" />
    </svg>
  );
}

// Each strip holds two identical halves, so sliding it left by half its width loops without a
// seam. Three tiles per half keep the screen covered up to very wide monitors.
function Strip({ className }: { className: string }) {
  return (
    <div className={`heaven-strip ${className}`}>
      {Array.from({ length: 6 }, (_, i) => (
        <Tile key={i} />
      ))}
    </div>
  );
}

export function HeavenClouds() {
  return (
    <div aria-hidden="true" className="heaven">
      <div className="heaven-glow" />
      <div className="heaven-rays" />
      <Strip className="heaven-strip-high" />
      <Strip className="heaven-strip-far" />
      <Strip className="heaven-strip-near" />
    </div>
  );
}
