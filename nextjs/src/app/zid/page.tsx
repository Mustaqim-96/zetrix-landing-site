import type { Metadata } from "next";
import ZidRuntime from "@/components/ZidRuntime";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./zid.css";

const TITLE = "ZID — Blockchain-based Identity Network";
const DESCRIPTION =
  "Zidentity provides blockchain-based identity, verifiable credentials and on-chain signing services for secure cross-border transactions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/zid" },
  openGraph: {
    type: "website",
    url: "/zid",
    siteName: "Zetrix",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ZidPage() {
  return (
    <div className="zid-page">
      <ZidRuntime />
      <a className="skip-link" href="#main">Skip to content</a>
      
        <SiteHeader homeLinkMode="document" />
      
        <main id="main">
          <section className="hero" id="hero" aria-labelledby="hero-title">
            <img className="hero-curve" src="/assets/zid/hero-curve.svg" alt="" aria-hidden="true" />
            <div className="hero-content">
              <h1 id="hero-title">Blockchain-based Identity Network</h1>
              <p className="hero-copy">Zidentity (ZID) offers Blockchain-based Identity (BID), Verifiable Credentials (VC) and on-chain signing services to the global market, which facilitates cross-border transactions with China.</p>
              <a className="button" href="#download">Get Started</a>
              <div className="hero-phone" aria-hidden="true"><img src="/assets/zid/hero-myid.webp" alt="" decoding="async" width="1500" height="3248" /></div>
            </div>
            <div className="ribbon-icons" aria-hidden="true">
              <div className="orbit-icon orbit-icon--1"><img className="icon-before" src="/assets/zid/icon-identity.webp" alt="" decoding="async" width="384" height="384" /><img className="icon-after" src="/assets/zid/icon-credential.webp" alt="" decoding="async" width="384" height="384" /></div>
              <div className="orbit-icon orbit-icon--2"><img className="icon-before" src="/assets/zid/icon-cross-border.webp" alt="" decoding="async" width="384" height="384" /><img className="icon-after" src="/assets/zid/icon-blockchain.webp" alt="" decoding="async" width="384" height="384" /></div>
              <div className="orbit-icon orbit-icon--3"><img className="icon-before" src="/assets/zid/icon-privacy.webp" alt="" decoding="async" width="384" height="384" /><img className="icon-after" src="/assets/zid/icon-signing.webp" alt="" decoding="async" width="384" height="384" /></div>
              <div className="orbit-icon orbit-icon--4"><img className="icon-before" src="/assets/zid/icon-identity.webp" alt="" decoding="async" width="384" height="384" /><img className="icon-after" src="/assets/zid/icon-credential.webp" alt="" decoding="async" width="384" height="384" /></div>
              <div className="orbit-icon orbit-icon--5"><img className="icon-before" src="/assets/zid/icon-cross-border.webp" alt="" decoding="async" width="384" height="384" /><img className="icon-after" src="/assets/zid/icon-blockchain.webp" alt="" decoding="async" width="384" height="384" /></div>
              <div className="orbit-icon orbit-icon--6"><img className="icon-before" src="/assets/zid/icon-privacy.webp" alt="" decoding="async" width="384" height="384" /><img className="icon-after" src="/assets/zid/icon-signing.webp" alt="" decoding="async" width="384" height="384" /></div>
            </div>
          </section>
      
          <section className="process" id="digitise" aria-labelledby="digitise-title">
            <div className="shell">
              <header className="process-head reveal">
                <h2 className="section-title" id="digitise-title">How to digitise Malaysian ID<br />and more Malaysian nationals?</h2>
              </header>
              <div className="process-grid" data-process-story>
                <div className="process-steps">
                  <article className="step-card" data-process-step="0"><div className="step-copy"><h3 className="step-title">Step 1</h3><p className="step-desc">Download and open the MyID Superapp, enter the homepage by creating a digital identity.</p></div><div className="step-phone"><img src="/assets/zid/step-1.webp" alt="MyID Superapp home screen" loading="lazy" decoding="async" width="750" height="1624" /></div></article>
                  <article className="step-card" data-process-step="1"><div className="step-copy"><h3 className="step-title">Step 2</h3><p className="step-desc">Select “Malaysian ID” as the certificate type.</p></div><div className="step-phone"><img src="/assets/zid/step-2.webp" alt="Apply credential screen" loading="lazy" decoding="async" width="750" height="1624" /></div></article>
                  <article className="step-card" data-process-step="2"><div className="step-copy"><h3 className="step-title">Step 3</h3><p className="step-desc">Apply through MyDigital ID.</p></div><div className="step-phone"><img src="/assets/zid/step-3.webp" alt="Malaysian ID selection screen" loading="lazy" decoding="async" width="750" height="1624" /></div></article>
                  <article className="step-card" data-process-step="3"><div className="step-copy"><h3 className="step-title">Step 4</h3><p className="step-desc">Real person authentication before submission.</p></div><div className="step-phone"><img src="/assets/zid/step-4.webp" alt="Identity details verification screen" loading="lazy" decoding="async" width="753" height="1624" /></div></article>
                  <article className="step-card" data-process-step="4"><div className="step-copy"><h3 className="step-title">Step 5</h3><p className="step-desc">View the successfully verified Malaysian ID certificate.</p></div><div className="step-phone"><img src="/assets/zid/step-5.webp" alt="Successful credential screen" loading="lazy" decoding="async" width="750" height="1624" /></div></article>
                  <article className="step-card" data-process-step="5"><div className="step-copy"><h3 className="step-title">Step 6</h3><p className="step-desc">Present the Malaysian ID card as a QR code.</p></div><div className="step-phone"><img src="/assets/zid/step-6.webp" alt="Malaysian ID credential QR code" loading="lazy" decoding="async" width="750" height="1624" /></div></article>
                </div>
              </div>
            </div>
          </section>
      
          <div className="download-about-handoff">
          <section className="download" id="download" aria-labelledby="download-title">
            <div className="download-content">
              <header className="download-head reveal">
                <h2 className="section-title" id="download-title">Digitise Your Credentials Now</h2>
                <p className="section-copy">Digitise credentials streamlines processes, reduces clutter, and ensures easy document access anytime, anywhere.</p>
              </header>
              <div className="download-grid">
                <article className="download-card reveal">
                  <div className="download-app-meta"><span>Download</span><h3>MyID Superapp</h3></div>
                  <div className="download-card-body">
                    <div className="download-stores">
                      <a className="download-store" href="#" aria-label="Download MyID Superapp on the App Store"><img src="/assets/zid/app-store.svg" alt="" /><span className="download-store-copy"><small>Download on the</small><strong>App Store</strong></span></a>
                      <a className="download-store" href="#" aria-label="Get MyID Superapp on Google Play"><img src="/assets/zid/google-play.svg" alt="" /><span className="download-store-copy"><small>GET IT ON</small><strong>Google Play</strong></span></a>
                    </div>
                    <div className="download-code"><div className="download-qr"><img src="/assets/zid/download-qr.webp" alt="QR code to download MyID Superapp" loading="lazy" decoding="async" width="800" height="800" /><span className="download-qr-badge"><img src="/assets/zid/myid-logo.webp" alt="" loading="lazy" decoding="async" width="152" height="152" /></span></div><p className="download-qr-label">Scan QR code to download</p></div>
                  </div>
                </article>
              </div>
            </div>
          </section>
      
          <section className="about" id="about" aria-labelledby="about-title">
            <div className="shell">
              <div className="about-card reveal">
                <div className="about-content">
                  <h2 className="section-title" id="about-title">About ZID</h2>
                  <div className="about-copy">
                    <p><strong>Zidentity (ZID)</strong> offers Blockchain-based Identifiers (BID), Verifiable Credentials (VC) and on-chain agreement signing services to the international market, which facilitates cross-border transactions with Malaysia.</p>
                    <p>Within the network, there are three primary roles involved in the exchange of verifiable credentials: the issuer, verifier and user; to ensure a secure and seamless verification.</p>
                    <p>Our collaboration with Beibu Gulf Investment Group and Xinghuo Blockchain Infrastructure enables seamless cross-border verification of credentials, ensuring secure and efficient identity management across borders.</p>
                  </div>
                </div>
                <div className="about-visual" aria-hidden="true">
                  <img className="about-backdrop" src="/assets/zid/about-zid-cinematic-v3.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="1981" height="793" />
                </div>
              </div>
            </div>
          </section>
          </div>
      
          <section className="powered" id="powered" aria-labelledby="powered-title">
            <div className="shell reveal">
              <h2 className="powered-title" id="powered-title">Powered by</h2>
              <div className="partner-grid">
                <div className="partner partner--zetrix"><img src="/assets/img/logo-zetrix.svg" alt="Zetrix" /></div>
                <div className="partner partner--myeg"><img src="/assets/zid/myeg.webp" alt="MYEG" loading="lazy" decoding="async" width="600" height="254" /></div>
              </div>
            </div>
          </section>
        </main>
      
        <SiteFooter />
    </div>
  );
}
