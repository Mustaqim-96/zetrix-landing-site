import type { Metadata } from "next";
import ZidRuntime from "@/components/ZidRuntime";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProcessStory from "@/components/ProcessStory";
import DownloadAppCard from "@/components/DownloadAppCard";
import GetStartedModal from "@/components/GetStartedModal";
import "./zid.css";

const TITLE = "ZID — Blockchain-based Identity Network";
const DESCRIPTION =
  "ZIdentity (ZID) offers Blockchain-based Identity (BID), Verifiable Credentials (VC) and on-chain signing services to the global market, helping you access the products and services you need.";

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
      
        <SiteHeader homeLinkMode="document-skip-intro" />
      
        <main id="main">
          <section className="hero" id="hero" aria-labelledby="hero-title">
            <img className="hero-curve" src="/assets/zid/hero-curve.svg" alt="" aria-hidden="true" />
            <div className="hero-content" data-hero-reveal>
              <h1 id="hero-title" data-hero-reveal-title>Blockchain-based Identity Network</h1>
              <p className="hero-copy" data-hero-reveal-subtitle>ZIdentity (ZID) offers Blockchain-based Identity (BID), Verifiable Credentials (VC) and on-chain signing services to the global market, helping you access the products and services you need.</p>
              <GetStartedModal />
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
              <ProcessStory />
            </div>
          </section>
      
          <div className="download-about-handoff">
          <section className="download" id="download" aria-labelledby="download-title">
            <div className="download-content">
              <header className="download-head reveal">
                <h2 className="section-title" id="download-title">Digitise Your Credentials Now</h2>
                <p className="section-copy">Digitised credentials keeps all your important documents in one place, accessible at anywhere, at anytime.</p>
              </header>
              <div className="download-grid">
                <DownloadAppCard className="reveal" />
              </div>
            </div>
          </section>
      
          <section className="about" id="about" aria-labelledby="about-title">
            <div className="shell">
              <div className="about-card reveal">
                <div className="about-content">
                  <h2 className="section-title" id="about-title">About ZID</h2>
                  <div className="about-copy">
                    <p><strong>ZIdentity (ZID)</strong> offers Blockchain-based Identity (BID), Verifiable Credentials (VC) and on-chain signing services to the global market, helping you access the products and services you need.</p>
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
