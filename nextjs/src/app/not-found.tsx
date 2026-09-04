import Link from "next/link";

// Branded 404. Renders inside the root layout, so /css/styles.css (and its
// design tokens + .btn styles) and the pre-paint theme are already applied.
export default function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "18px",
        padding: "40px 24px",
        background: "var(--theme-bg, var(--bg))",
        color: "var(--theme-text, var(--white))",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: "clamp(64px, 16vw, 132px)",
          lineHeight: 1,
          margin: 0,
          color: "var(--red)",
          letterSpacing: "-0.03em",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: "clamp(22px, 4vw, 32px)",
          margin: 0,
        }}
      >
        This page doesn&rsquo;t exist
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "16px",
          lineHeight: 1.6,
          maxWidth: "42ch",
          margin: 0,
          color: "var(--theme-text-secondary, var(--grey))",
        }}
      >
        The link may be broken, or the page may have moved. Let&rsquo;s get you
        back on track.
      </p>
      <Link className="btn btn--red" href="/" style={{ marginTop: "8px", padding: "12px 22px" }}>
        Back to home
      </Link>
    </main>
  );
}
