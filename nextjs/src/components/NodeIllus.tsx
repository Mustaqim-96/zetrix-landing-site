// Animated node-network illustrations for the ecosystem cards.
//
// Inline SVG (not <img>) so they are theme-aware and animated via
// public/css/styles.css. Recreated to match the original motion design:
// a signal radiates out from the central hub (nodes fill in a wave), the
// focus node carries a pulsing red halo, and — on the Smart Contract card —
// the spokes pulse bold and three tech badges (Node.js / Java / Go) feed in.
// Geometry + per-element animation delays are generated here; colour and
// keyframes live in the stylesheet.

type Variant = "smart-contract" | "w3c-identifiers" | "verifiable-credential";

const R = 13; // node ring radius
const r1 = (n: number) => Math.round(n * 10) / 10;
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Radial delay so activation spreads out from the hub.
function delay(pt: number[], center: number[], max: number, span = 1.9) {
  return `${r1((dist(pt, center) / max) * span)}s`;
}

function FocusHalo({ cx, cy, r = 22 }: { cx: number; cy: number; r?: number }) {
  return <circle className="focus-halo" cx={cx} cy={cy} r={r} />;
}

function Cube({ cx, cy }: { cx: number; cy: number }) {
  const w = 15;
  const T = [cx, cy - 16], Rt = [cx + w, cy - 8], B = [cx, cy], Lt = [cx - w, cy - 8];
  const Bc = [cx, cy + 15], Lb = [cx - w, cy + 7], Rb = [cx + w, cy + 7];
  const pt = (a: number[]) => `${r1(a[0])},${r1(a[1])}`;
  const P = (a: number[]) => `${r1(a[0])} ${r1(a[1])}`;
  return (
    <g className="cube">
      <FocusHalo cx={cx} cy={cy} r={22} />
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
      <FocusHalo cx={cx} cy={cy} r={20} />
      <circle className="check-circle" cx={cx} cy={cy} r={14} />
      <path className="check-mark" d={`M${cx - 6} ${cy + 0.5} l3.6 4.2 l8.4 -9`} />
    </g>
  );
}

// Simplified, recognisable tech-stack marks on a dark badge.
function TechBadge({ x, y, kind }: { x: number; y: number; kind: "node" | "java" | "go" }) {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = ((90 + i * 60) * Math.PI) / 180;
    return `${r1(x + 8 * Math.cos(a))},${r1(y + 8 * Math.sin(a))}`;
  }).join(" ");
  return (
    <g className="badge">
      <circle className="badge-bg" cx={x} cy={y} r={15} />
      <circle className="badge-ring" cx={x} cy={y} r={15} />
      {kind === "node" && <polygon points={hex} fill="#6cc24a" />}
      {kind === "java" && (
        <g>
          <path d={`M${x - 5} ${y - 1} h10 v3.5 a5 5 0 0 1 -10 0 z`} fill="#e2574c" />
          <path d={`M${x + 5} ${y - 0.5} a3 3 0 0 1 0 4.5`} fill="none" stroke="#e2574c" strokeWidth="1.4" />
          <path d={`M${x - 2.5} ${y - 6.5} q2 1.5 0 3 M${x + 1.5} ${y - 6.5} q2 1.5 0 3`} fill="none" stroke="#e2574c" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}
      {kind === "go" && (
        <text x={x} y={y + 3.4} fontSize="9" fontWeight="700" fill="#2bb4d6" textAnchor="middle" fontFamily="var(--font-body), sans-serif">GO</text>
      )}
    </g>
  );
}

function Ring({ x, y, d }: { x: number; y: number; d: string }) {
  return <circle className="ring" cx={r1(x)} cy={r1(y)} r={R} style={{ animationDelay: d }} />;
}
function Link({ a, b, cls = "link", d, s }: { a: number[]; b: number[]; cls?: string; d?: string; s?: number }) {
  return (
    <line
      className={cls}
      x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])}
      style={s !== undefined ? { animationDelay: `${r1(s)}s` } : d ? { animationDelay: d } : undefined}
    />
  );
}

function gridGeom(cols: number[], rows: number[], skip: [number, number]) {
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
  return { links, rings, center: [cols[skip[0]], rows[skip[1]]] };
}

export default function NodeIllus({ variant }: { variant: Variant }) {
  const svgProps = {
    className: `node-illus node-illus--${variant}`,
    viewBox: "0 0 480 270",
    fill: "none",
    role: "img" as const,
    "aria-hidden": true,
  };

  if (variant !== "smart-contract") {
    const [cols, rows, skip] =
      variant === "w3c-identifiers"
        ? [[66, 124, 182, 240, 298, 356, 414], [75, 135, 195], [3, 1] as [number, number]]
        : [[96, 168, 240, 312, 384], [75, 135, 195], [2, 1] as [number, number]];
    const { links, rings, center } = gridGeom(cols, rows, skip);
    const maxR = Math.max(...rings.map((p) => dist(p, center)));
    return (
      <svg {...svgProps}>
        <g className="links">
          {links.map((l, i) => (
            <Link key={i} a={l[0]} b={l[1]} d={delay([(l[0][0] + l[1][0]) / 2, (l[0][1] + l[1][1]) / 2], center, maxR)} />
          ))}
        </g>
        <g className="rings">
          {rings.map((p, i) => <Ring key={i} x={p[0]} y={p[1]} d={delay(p, center, maxR)} />)}
        </g>
        {variant === "w3c-identifiers" ? <Cube cx={center[0]} cy={center[1]} /> : <CheckNode cx={center[0]} cy={center[1]} />}
      </svg>
    );
  }

  // smart-contract: radial network, 8 outer nodes + centre cube + tech badges
  const cx = 240, cy = 152, rx = 150, ry = 66;
  const outer = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  const top = outer[6]; // angle 270° → top node
  const maxR = Math.max(...outer.map((o) => dist(o, [cx, cy])));
  const badges: { x: number; y: number; kind: "node" | "java" | "go" }[] = [
    { x: 200, y: 40, kind: "node" },
    { x: 240, y: 34, kind: "java" },
    { x: 280, y: 40, kind: "go" },
  ];
  return (
    <svg {...svgProps}>
      <g className="links">
        {outer.map((o, i) => <Link key={i} a={o} b={outer[(i + 1) % outer.length]} d={delay(o, [cx, cy], maxR)} />)}
      </g>
      <g className="spokes">
        {outer.map((o, i) => <Link key={i} a={[cx, cy]} b={o} cls="spoke" s={i * 0.22} />)}
      </g>
      <g className="badge-connects">
        {badges.map((b, i) => <Link key={i} a={[b.x, b.y + 15]} b={top} cls="badge-connect" />)}
      </g>
      <g className="rings">{outer.map((o, i) => <Ring key={i} x={o[0]} y={o[1]} d={delay(o, [cx, cy], maxR)} />)}</g>
      <Cube cx={cx} cy={cy} />
      {badges.map((b, i) => <TechBadge key={i} x={b.x} y={b.y} kind={b.kind} />)}
    </svg>
  );
}
