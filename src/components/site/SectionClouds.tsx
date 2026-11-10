import { useId } from "react";

/**
 * Small cloud banks tucked into the corners of a section, in the same billowing style as
 * HeavenClouds. They are tallest at the outer edge and taper inward, then fade out, so they never
 * sit behind the content. Purely decorative, CSS/SVG-only (see .section-clouds in globals.css).
 * Put it as the first child of a `relative isolate overflow-hidden` section.
 *
 * tone="gold"  → cream and gilded clouds, for light sections.
 * tone="night" → cool slate clouds, for the dark bands.
 */

type Circle = [cx: number, cy: number, r: number];

// Two bank shapes on a 360×160 tile: a flat base along the bottom, puffs tallest at the left
// (outer) edge and tapering to the right. Fixed numbers so server and client render the same.
const bankA: Circle[] = [
  [28, 112, 52],
  [88, 92, 62],
  [150, 104, 48],
  [205, 122, 38],
  [250, 134, 28],
  [290, 142, 20],
];
const bankB: Circle[] = [
  [22, 124, 46],
  [74, 98, 58],
  [132, 84, 50],
  [186, 110, 42],
  [236, 126, 30],
  [282, 140, 22],
];

// Colours for each tone: [crown, upper, lower, underside] for the back bank and
// [crown, middle, underside] for the front one.
const tones = {
  gold: { back: ["#fff0c2", "#fbd77d", "#efb03a", "#d28c1f"], front: ["#fff6da", "#fbdf94", "#ecb53f"] },
  night: { back: ["#93a8bd", "#6c8297", "#50657a", "#3d4e5e"], front: ["#adbfd0", "#8199ae", "#5f7489"] },
} as const;

function Bank({ circles, fill, className }: { circles: Circle[]; fill: string; className: string }) {
  return (
    <svg viewBox="0 0 360 160" preserveAspectRatio="xMinYMax meet" className={className} focusable="false" fill={fill}>
      {circles.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
      <rect x="-20" y="134" width="310" height="26" />
    </svg>
  );
}

type Pos = "tl" | "tr" | "bl" | "br";

// Each corner mixes the two shapes so the four never look like copies of each other.
const corners: [Pos, "a" | "b"][] = [
  ["tl", "b"],
  ["tr", "a"],
  ["bl", "a"],
  ["br", "b"],
];

export function SectionClouds({
  tone = "gold",
  edges = "both",
}: {
  tone?: keyof typeof tones;
  edges?: "top" | "bottom" | "both";
}) {
  const { back, front } = tones[tone];
  const id = useId().replace(/:/g, "");
  const backId = `${id}-back`;
  const frontId = `${id}-front`;

  return (
    <div aria-hidden="true" className={`section-clouds section-clouds-${tone}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={backId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="160">
            <stop offset="0" stopColor={back[0]} />
            <stop offset="0.45" stopColor={back[1]} />
            <stop offset="0.8" stopColor={back[2]} />
            <stop offset="1" stopColor={back[3]} />
          </linearGradient>
          <linearGradient id={frontId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="160">
            <stop offset="0" stopColor={front[0]} />
            <stop offset="0.6" stopColor={front[1]} />
            <stop offset="1" stopColor={front[2]} />
          </linearGradient>
        </defs>
      </svg>

      {corners
        .filter(([pos]) => edges === "both" || (edges === "top" ? pos.startsWith("t") : pos.startsWith("b")))
        .map(([pos, variant]) => (
          <div key={pos} className={`sc-corner sc-${pos}`}>
            <Bank circles={variant === "a" ? bankB : bankA} fill={`url(#${backId})`} className="sc-back" />
            <Bank circles={variant === "a" ? bankA : bankB} fill={`url(#${frontId})`} className="sc-front" />
          </div>
        ))}
    </div>
  );
}