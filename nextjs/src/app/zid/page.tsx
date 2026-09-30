import type { Metadata } from "next";
import ZidRuntime from "@/components/ZidRuntime";
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
      
        <header className="nav-wrap">
          <button className="nav__backdrop" type="button" data-nav-backdrop hidden aria-label="Close navigation menu"></button>
          <nav className="nav" data-nav aria-label="Primary">
            {/* Full navigation intentionally resets the homepage's legacy one-shot animation runtime. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="nav__logo" href="/" aria-label="Zetrix home"><img className="nav__logo-mark nav__logo-mark--dark" src="/assets/img/logo-zetrix.svg" alt="Zetrix" /><img className="nav__logo-mark nav__logo-mark--light" src="/assets/img/logo-zetrix-light.svg" alt="" aria-hidden="true" /></a>
            <ul className="nav__menu">
              <li><button className="nav__link" type="button" data-nav-trigger="developers" aria-controls="nav-group-developers" aria-expanded="false">Developers <span className="caret" aria-hidden="true"></span></button></li>
              <li><button className="nav__link" type="button" data-nav-trigger="individuals" aria-controls="nav-group-individuals" aria-expanded="false">Individuals <span className="caret" aria-hidden="true"></span></button></li>
              <li><button className="nav__link" type="button" data-nav-trigger="ecosystem" aria-controls="nav-group-ecosystem" aria-expanded="false">Ecosystem <span className="caret" aria-hidden="true"></span></button></li>
              <li><button className="nav__link" type="button" data-nav-trigger="tools" aria-controls="nav-group-tools" aria-expanded="false">Tools <span className="caret" aria-hidden="true"></span></button></li>
              <li><button className="nav__link" type="button" data-nav-trigger="discover" aria-controls="nav-group-discover" aria-expanded="false">Discover <span className="caret" aria-hidden="true"></span></button></li>
              <li><button className="nav__link" type="button" data-nav-trigger="investors" aria-controls="nav-group-investors" aria-expanded="false">Investors <span className="caret" aria-hidden="true"></span></button></li>
            </ul>
            <a className="btn btn--red nav__cta" href="https://www.zetrix.com/buidl-zetrix/">BUIDL Now</a>
            <button className="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to light mode"><span className="theme-toggle__track" aria-hidden="true"><span className="theme-toggle__orb"></span></span></button>
            <button className="nav__mobile-toggle" type="button" data-nav-mobile-toggle aria-label="Open navigation menu" aria-controls="nav-dropdown" aria-expanded="false"><span></span><span></span></button>
            <div className="nav-dropdown" data-nav-panel id="nav-dropdown" role="navigation" aria-label="Navigation menu" hidden>
              <div className="nav-dropdown__surface">
                <section className="nav-panel__group" id="nav-group-developers" data-nav-group="developers" data-nav-count="2">
                  <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="developers" aria-controls="nav-group-developers-content" aria-expanded="false"><span>Developers</span><span className="caret" aria-hidden="true"></span></button>
                  <div className="nav-panel__content" id="nav-group-developers-content" data-nav-group-content>
                    <a className="nav-card" href="https://www.zetrix.com/buidl-zetrix/"><span className="nav-card__icon"><img src="/assets/icons/lucide/code-2.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">#BUIDL With Zetrix</span><span className="nav-card__desc">Start building on the Zetrix network.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="https://www.zetrix.com/bug-bounty-programme/"><span className="nav-card__icon"><img src="/assets/icons/lucide/bug.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Bug Bounty Programme</span><span className="nav-card__desc">Help strengthen Zetrix and earn rewards.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  </div>
                </section>
                <section className="nav-panel__group" id="nav-group-individuals" data-nav-group="individuals" data-nav-count="2">
                  <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="individuals" aria-controls="nav-group-individuals-content" aria-expanded="false"><span>Individuals</span><span className="caret" aria-hidden="true"></span></button>
                  <div className="nav-panel__content" id="nav-group-individuals-content" data-nav-group-content>
                    <a className="nav-card" href="#download"><span className="nav-card__icon"><img src="/assets/icons/lucide/wallet-cards.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Zetrix Wallet</span><span className="nav-card__desc">Manage assets and trusted digital credentials.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="#digitise"><span className="nav-card__icon"><img src="/assets/icons/lucide/scan-face.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">ZID</span><span className="nav-card__desc">Create and present a verifiable digital identity.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  </div>
                </section>
                <section className="nav-panel__group" id="nav-group-ecosystem" data-nav-group="ecosystem" data-nav-count="2">
                  <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="ecosystem" aria-controls="nav-group-ecosystem-content" aria-expanded="false"><span>Ecosystem</span><span className="caret" aria-hidden="true"></span></button>
                  <div className="nav-panel__content" id="nav-group-ecosystem-content" data-nav-group-content>
                    <a className="nav-card" href="https://www.zetrix.com/zetrix-ecosystems/"><span className="nav-card__icon"><img src="/assets/icons/lucide/blocks.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Zetrix Ecosystem</span><span className="nav-card__desc">Explore applications and partners built on Zetrix.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="https://www.zetrix.com/global-accelerator-programme/"><span className="nav-card__icon"><img src="/assets/icons/lucide/rocket.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Accelerator</span><span className="nav-card__desc">Grow Web3 ideas with global support.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  </div>
                </section>
                <section className="nav-panel__group" id="nav-group-tools" data-nav-group="tools" data-nav-count="3">
                  <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="tools" aria-controls="nav-group-tools-content" aria-expanded="false"><span>Tools</span><span className="caret" aria-hidden="true"></span></button>
                  <div className="nav-panel__content" id="nav-group-tools-content" data-nav-group-content>
                    <a className="nav-card" href="https://explorer.zetrix.com/"><span className="nav-card__icon"><img src="/assets/icons/lucide/search-code.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Block Explorer</span><span className="nav-card__desc">Inspect blocks, transactions, and accounts.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="https://ds.zetrix.com/"><span className="nav-card__icon"><img src="/assets/icons/lucide/activity.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Node Monitor</span><span className="nav-card__desc">Monitor Zetrix network node performance.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="https://ide.zetrix.com/"><span className="nav-card__icon"><img src="/assets/icons/lucide/file-code-2.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Smart Contract</span><span className="nav-card__desc">Build and deploy smart contracts.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  </div>
                </section>
                <section className="nav-panel__group" id="nav-group-discover" data-nav-group="discover" data-nav-count="3">
                  <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="discover" aria-controls="nav-group-discover-content" aria-expanded="false"><span>Discover</span><span className="caret" aria-hidden="true"></span></button>
                  <div className="nav-panel__content" id="nav-group-discover-content" data-nav-group-content>
                    <a className="nav-card" href="https://www.zetrix.com/about-zetrix/"><span className="nav-card__icon"><img src="/assets/icons/lucide/badge-info.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">About Zetrix</span><span className="nav-card__desc">Learn about the Zetrix public blockchain.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="https://www.zetrix.com/media-and-community/"><span className="nav-card__icon"><img src="/assets/icons/lucide/users-round.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Media and community</span><span className="nav-card__desc">Connect with Zetrix news and communities.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="https://www.zetrix.com/jobs/"><span className="nav-card__icon"><img src="/assets/icons/lucide/briefcase-business.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Careers</span><span className="nav-card__desc">Build the future of trust with Zetrix.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  </div>
                </section>
                <section className="nav-panel__group" id="nav-group-investors" data-nav-group="investors" data-nav-count="2">
                  <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="investors" aria-controls="nav-group-investors-content" aria-expanded="false"><span>Investors</span><span className="caret" aria-hidden="true"></span></button>
                  <div className="nav-panel__content" id="nav-group-investors-content" data-nav-group-content>
                    <a className="nav-card" href="https://www.zetrix.com/investor-relations/"><span className="nav-card__icon"><img src="/assets/icons/lucide/landmark.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Investor Relations</span><span className="nav-card__desc">Access the investor information centre.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                    <a className="nav-card" href="https://www.zetrix.com/investor-relations/reports-presentations/"><span className="nav-card__icon"><img src="/assets/icons/lucide/presentation.svg" alt="" /></span><span className="nav-card__copy"><span className="nav-card__title">Reports &amp; Presentations</span><span className="nav-card__desc">Access reports and presentation materials.</span></span><span className="nav-card__arrow"><img src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  </div>
                </section>
                <div className="nav-dropdown__theme"><span className="nav-dropdown__theme-label">Appearance</span><button className="theme-toggle nav-dropdown__theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to light mode"><span className="theme-toggle__track" aria-hidden="true"><span className="theme-toggle__orb"></span></span></button></div>
              </div>
            </div>
          </nav>
        </header>
      
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
      
          <section className="verify" id="verify" aria-labelledby="verify-title">
            <div className="shell">
              <header className="reveal"><h2 className="section-title" id="verify-title">How to verify the Digitised Credentials?</h2></header>
              <div className="verify-panel reveal">
                <div className="verify-steps" role="group" aria-label="Credential verification steps">
                  <button className="verify-step is-active" type="button" data-verify-step="0" aria-pressed="true"><h3>Step 1</h3><p>Download and open the Zetrix Wallet App.</p><span className="verify-progress" aria-hidden="true"></span></button>
                  <button className="verify-step" type="button" data-verify-step="1" aria-pressed="false"><h3>Step 2</h3><p>Select Scan in the application.</p><span className="verify-progress" aria-hidden="true"></span></button>
                  <button className="verify-step" type="button" data-verify-step="2" aria-pressed="false"><h3>Step 3</h3><p>Scan the presented Credential QR code.</p><span className="verify-progress" aria-hidden="true"></span></button>
                  <button className="verify-step" type="button" data-verify-step="3" aria-pressed="false"><h3>Step 4</h3><p>View the verified result.</p><span className="verify-progress" aria-hidden="true"></span></button>
                </div>
                <div className="verify-demo" data-verify-active="0"><div className="verify-phone" role="img" aria-label="Zetrix Wallet verification walkthrough"><img className="verify-media is-active" data-verify-media="0" src="/assets/zid/verify-wallet-figma.webp" alt="" aria-hidden="false" loading="lazy" decoding="async" width="750" height="1624" /><img className="verify-media" data-verify-media="1" src="/assets/zid/verify-step-2.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="750" height="1624" /><img className="verify-media" data-verify-media="2" src="/assets/zid/verify-wallet-figma.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="750" height="1624" /><img className="verify-media" data-verify-media="3" src="/assets/zid/verify-wallet-figma.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="750" height="1624" /></div></div>
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
                <article className="download-card download-card--wallet reveal">
                  <div className="download-app-meta"><span>Download</span><h3>Zetrix Wallet+</h3></div>
                  <div className="download-card-body">
                    <div className="download-stores">
                      <a className="download-store" href="#" aria-label="Download Zetrix Wallet Plus on the App Store"><img src="/assets/zid/app-store.svg" alt="" /><span className="download-store-copy"><small>Download on the</small><strong>App Store</strong></span></a>
                      <a className="download-store" href="#" aria-label="Get Zetrix Wallet Plus on Google Play"><img src="/assets/zid/google-play.svg" alt="" /><span className="download-store-copy"><small>GET IT ON</small><strong>Google Play</strong></span></a>
                    </div>
                    <div className="download-code"><div className="download-qr"><img src="/assets/zid/download-qr.webp" alt="QR code to download Zetrix Wallet Plus" loading="lazy" decoding="async" width="800" height="800" /><span className="download-qr-badge"><img src="/assets/zid/zetrix-wallet.webp" alt="" loading="lazy" decoding="async" width="152" height="152" /></span></div><p className="download-qr-label">Scan QR code to download</p></div>
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
                <div className="partner partner--xinghuo"><span className="partner-logo"><img src="/assets/zid/xinghuo.webp" alt="Xinghuo Blockchain Infrastructure" loading="lazy" decoding="async" width="652" height="217" /><img className="partner-logo-light" src="/assets/zid/xinghuo.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="652" height="217" /></span></div>
                <div className="partner partner--beibu"><span className="partner-logo"><img src="/assets/zid/beibu-gulf.webp" alt="Beibu Gulf Investment Group" loading="lazy" decoding="async" width="652" height="217" /><img className="partner-logo-light" src="/assets/zid/beibu-gulf.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="652" height="217" /></span></div>
                <div className="partner partner--zetrix"><img src="/assets/img/logo-zetrix.svg" alt="Zetrix" /></div>
                <div className="partner partner--myeg"><img src="/assets/zid/myeg.webp" alt="MYEG" loading="lazy" decoding="async" width="600" height="254" /></div>
              </div>
            </div>
          </section>
        </main>
      
        <footer className="footer">
          <div className="footer__inner">
            <div className="footer__top">
              <nav className="footer__nav" aria-label="Footer">
                <div className="footer__col"><h4 className="footer__head">Product</h4><a href="https://www.zetrix.com/buidl-zetrix/">#BUIDL With Zetrix</a><a href="https://www.zetrix.com/bug-bounty-programme/">Bug Bounty Programme</a></div>
                <div className="footer__col"><h4 className="footer__head">Individuals</h4><a href="#download">Zetrix Wallet</a></div>
                <div className="footer__col"><h4 className="footer__head">Ecosystem</h4><a href="https://www.zetrix.com/zetrix-ecosystems/">Zetrix Ecosystem</a><a href="https://www.zetrix.com/global-accelerator-programme/">Accelerator</a></div>
                <div className="footer__col"><h4 className="footer__head">Tools</h4><a href="https://ds.zetrix.com/">Node Monitor</a><a href="https://explorer.zetrix.com/">Block Explorer</a><a href="https://ide.zetrix.com/">Smart Contract</a></div>
                <div className="footer__col"><h4 className="footer__head">Discover</h4><a href="https://www.zetrix.com/about-zetrix/">About Zetrix</a><a href="https://www.zetrix.com/media-and-community/">Media and community</a><a href="https://www.zetrix.com/jobs/">Careers</a></div>
              </nav>
              <div className="footer__socials" aria-label="Zetrix social channels">
                <a href="#" className="social" aria-label="Telegram"><img src="/assets/footer/telegram.svg" alt="" /></a><a href="#" className="social" aria-label="Discord"><img src="/assets/footer/discord.svg" alt="" /></a><a href="#" className="social" aria-label="X"><img src="/assets/footer/x.svg" alt="" /></a><a href="#" className="social" aria-label="TikTok"><img src="/assets/footer/tiktok.svg" alt="" /></a>
              </div>
            </div>
            <div className="footer__brand">
              <div className="footer__wordmark-art" data-footer-spotlight aria-hidden="true">
                <img className="footer__wordmark-base" src="/assets/footer/zetrix-wordmark-fill.svg" alt="" />
                <img className="footer__wordmark-color-trail footer__wordmark--dark" src="/assets/footer/zetrix-wordmark-fill.svg" alt="" />
                <img className="footer__wordmark-spotlight footer__wordmark--dark" src="/assets/footer/zetrix-wordmark-fill.svg" alt="" />
                <img className="footer__wordmark-color-trail footer__wordmark--light" src="/assets/footer/zetrix-wordmark-fill-light.svg" alt="" />
                <img className="footer__wordmark-spotlight footer__wordmark--light" src="/assets/footer/zetrix-wordmark-fill-light.svg" alt="" />
              </div>
              <div className="footer__bottom"><p className="footer__copy">© 2026 Zetrix. All rights reserved.</p><div className="footer__legal"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div></div>
            </div>
          </div>
        </footer>
    </div>
  );
}
