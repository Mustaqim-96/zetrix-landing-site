// The "Download MyID Superapp" card: store buttons plus the QR code. Shared by
// the ZID download section and the hero's Get Started modal so the links and
// QR live in one place.
export default function DownloadAppCard({
  className = "",
  titleId,
}: {
  className?: string;
  titleId?: string;
}) {
  return (
    <article className={`download-card ${className}`.trim()}>
      <div className="download-app-meta"><span>Download</span><h3 id={titleId}>MyID Superapp</h3></div>
      <div className="download-card-body">
        <div className="download-stores">
          <a className="download-store" href="#" aria-label="Download MyID Superapp on the App Store"><img src="/assets/zid/app-store.svg" alt="" /><span className="download-store-copy"><small>Download on the</small><strong>App Store</strong></span></a>
          <a className="download-store" href="#" aria-label="Get MyID Superapp on Google Play"><img src="/assets/zid/google-play.svg" alt="" /><span className="download-store-copy"><small>GET IT ON</small><strong>Google Play</strong></span></a>
        </div>
        <div className="download-code"><div className="download-qr"><img src="/assets/zid/download-qr.webp" alt="QR code to download MyID Superapp" loading="lazy" decoding="async" width="800" height="800" /><span className="download-qr-badge"><img src="/assets/zid/myid-logo.webp" alt="" loading="lazy" decoding="async" width="152" height="152" /></span></div><p className="download-qr-label">Scan QR code to download</p></div>
      </div>
    </article>
  );
}
