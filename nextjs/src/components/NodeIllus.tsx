// Animated node-network illustrations for the ecosystem cards.
//
// These render as inline SVG (not <img>) so they are theme-aware and animated
// via public/css/styles.css (.node-illus .ring / .link / .spoke / .cube / etc.).
// They replaced flattened static WebPs whose faint connecting links had become
// invisible on the light theme. Geometry is generated here so counts/positions
// are easy to tweak — styling and motion live in the stylesheet.

type Variant = "smart-contract" | "w3c-identifiers" | "verifiable-credential";

const R = 13; // node ring radius
const r1 = (n: number) => Math.round(n * 10) / 10;

function Cube({ cx, cy }: { cx: number; cy: number }) {
  const w = 15;
  const T = [cx, cy - 16], Rt = [cx + w, cy - 8], B = [cx, cy], Lt = [cx - w, cy - 8];
  const Bc = [cx, cy + 15], Lb = [cx - w, cy + 7], Rb = [cx + w, cy + 7];
  const pt = (a: number[]) => `${r1(a[0])},${r1(a[1])}`;
  const P = (a: number[]) => `${r1(a[0])} ${r1(a[1])}`;
  return (
    <g className="cube">
      <circle className="cube-glow" cx={cx} cy={cy} r={24} />
      <polygon className="cf cf-top" points={`${pt(T)} ${pt(Rt)} ${pt(B)} ${pt(Lt)}`} />
      <polygon className="cf cf-left" points={`${pt(Lt)} ${pt(B)} ${pt(Bc)} ${pt(Lb)}`} />
      <polygon className="cf cf-right" points={`${pt(Rt)} ${pt(B)} ${pt(Bc)} ${pt(Rb)}`} />
      <path className="ce" d={`M${P(T)} L${P(B)} M${P(Lt)} L${P(B)} L${P(Bc)} M${P(Rt)} L${P(B)}`} />
    </g>
  );
}

function CheckNode({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="node-check">
      <circle className="cube-glow" cx={cx} cy={cy} r={22} />
      <circle className="check-circle" cx={cx} cy={cy} r={15} />
      <path className="check-mark" d={`M${cx - 6.5} ${cy + 0.5} l4 4.5 l9 -10`} />
    </g>
  );
}

function Ring({ x, y }: { x: number; y: number }) {
  return <circle className="ring" cx={r1(x)} cy={r1(y)} r={R} />;
}
function Link({ a, b, cls = "link" }: { a: number[]; b: number[]; cls?: string }) {
  return <line className={cls} x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])} />;
}

function grid(cols: number[], rows: number[], skip: [number, number]) {
  const links: [number[], number[]][] = [];
  for (let r = 0; r < rows.length; r++)
    for (let c = 0; c < cols.length - 1; c++)
      links.push([[cols[c], rows[r]], [cols[c + 1], rows[r]]]);
  for (let c = 0; c < cols.length; c++)
    for (let r = 0; r < rows.length - 1; r++)
      links.push([[cols[c], rows[r]], [cols[c], rows[r + 1]]]);
  const rings: number[][] = [];
  for (let r = 0; r < rows.length; r++)
    for (let c = 0; c < cols.length; c++)
      if (!(c === skip[0] && r === skip[1])) rings.push([cols[c], rows[r]]);
  return { links, rings, center: [cols[skip[0]], rows[skip[1]]] as number[] };
}

export default function NodeIllus({ variant }: { variant: Variant }) {
  const svgProps = {
    className: `node-illus node-illus--${variant}`,
    viewBox: "0 0 480 270",
    fill: "none",
    role: "img" as const,
    "aria-hidden": true,
  };

  if (variant === "w3c-identifiers") {
    const { links, rings, center } = grid([66, 124, 182, 240, 298, 356, 414], [75, 135, 195], [3, 1]);
    return (
      <svg {...svgProps}>
        <g className="links">{links.map((l, i) => <Link key={i} a={l[0]} b={l[1]} />)}</g>
        <g className="rings">{rings.map((p, i) => <Ring key={i} x={p[0]} y={p[1]} />)}</g>
        <Cube cx={center[0]} cy={center[1]} />
      </svg>
    );
  }

  if (variant === "verifiable-credential") {
    const { links, rings, center } = grid([96, 168, 240, 312, 384], [75, 135, 195], [2, 1]);
    return (
      <svg {...svgProps}>
        <g className="links">{links.map((l, i) => <Link key={i} a={l[0]} b={l[1]} />)}</g>
        <g className="rings">{rings.map((p, i) => <Ring key={i} x={p[0]} y={p[1]} />)}</g>
        <CheckNode cx={center[0]} cy={center[1]} />
      </svg>
    );
  }

  // smart-contract: radial network, 8 outer nodes + centre cube
  const cx = 240, cy = 135, rx = 155, ry = 82;
  const outer = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  return (
    <svg {...svgProps}>
      <g className="links">
        {outer.map((o, i) => <Link key={i} a={o} b={outer[(i + 1) % outer.length]} />)}
      </g>
      <g className="spokes">
        {outer.map((o, i) => <Link key={i} a={[cx, cy]} b={o} cls="spoke" />)}
      </g>
      <g className="rings">{outer.map((o, i) => <Ring key={i} x={o[0]} y={o[1]} />)}</g>
      <Cube cx={cx} cy={cy} />
    </svg>
  );
}
