// Faithful conversion of the original index.html body.
//
// This page is intentionally static markup: all interactivity (3D globe, scroll
// choreography, carousels, nav dropdown, theme toggle) is driven by the vendored
// libraries and vanilla-JS animation scripts loaded via <SiteScripts /> in the
// root layout. Those scripts target elements by class / id / data-attribute, so
// the markup below preserves every hook exactly.
//
// Plain <img> tags are used deliberately (not next/image): the animation code and
// CSS select images by class and mutate them directly, and next/image's wrapper
// DOM + generated srcset would break that targeting and the pixel-tuned layout.

export default function Home() {
  return (
    <>
      <div className="site-intro" data-site-intro aria-hidden="true">
        <div className="site-intro__canvas site-intro__canvas--brand"></div>
        <div className="site-intro__canvas site-intro__canvas--dark"></div>
        <div className="site-intro__logo" data-site-intro-logo>
          <img className="site-intro__mark site-intro__mark--light" src="/assets/img/logo-zetrix-intro.svg" alt="" />
          <img className="site-intro__mark site-intro__mark--white" src="/assets/img/logo-zetrix-intro.svg" alt="" />
          <img className="site-intro__mark site-intro__mark--nav" src="/assets/img/logo-zetrix.svg" alt="" />
        </div>
      </div>

      {/* ============================= NAV ============================= */}
      <header className="nav-wrap">
        <button className="nav__backdrop" type="button" data-nav-backdrop hidden aria-label="Close navigation menu"></button>

        <nav className="nav" data-nav aria-label="Primary">
          <a className="nav__logo" href="#" aria-label="Zetrix home">
            <img src="/assets/img/logo-zetrix.svg" alt="Zetrix" />
          </a>

          <ul className="nav__menu">
            <li><button className="nav__link" type="button" data-nav-trigger="developers" aria-controls="nav-group-developers" aria-expanded="false">Developers <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="individuals" aria-controls="nav-group-individuals" aria-expanded="false">Individuals <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="ecosystem" aria-controls="nav-group-ecosystem" aria-expanded="false">Ecosystem <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="tools" aria-controls="nav-group-tools" aria-expanded="false">Tools <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="discover" aria-controls="nav-group-discover" aria-expanded="false">Discover <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="investors" aria-controls="nav-group-investors" aria-expanded="false">Investors <span className="caret" aria-hidden="true"></span></button></li>
          </ul>

          <a className="btn btn--red nav__cta" href="#">BUIDL Now</a>

          <button className="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to light mode" title="Switch to light mode">
            <span className="theme-toggle__track" aria-hidden="true">
              <span className="theme-toggle__orb"></span>
            </span>
          </button>

          <button className="nav__mobile-toggle" type="button" data-nav-mobile-toggle aria-label="Open navigation menu" aria-controls="nav-dropdown" aria-expanded="false">
            <span></span><span></span>
          </button>

          <div className="nav-dropdown" data-nav-panel id="nav-dropdown" role="navigation" aria-label="Navigation menu">
            <div className="nav-dropdown__surface">
              <section className="nav-panel__group" id="nav-group-developers" data-nav-group="developers" data-nav-count="2">
                <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="developers" aria-controls="nav-group-developers-content" aria-expanded="false"><span>Developers</span><span className="caret" aria-hidden="true"></span></button>
                <div className="nav-panel__content" id="nav-group-developers-content" data-nav-group-content>
                  <a className="nav-card" href="https://www.zetrix.com/buidl-zetrix/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/code-2.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">#BUIDL With Zetrix</span><span className="nav-card__desc">Start building on the Zetrix network.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/bug-bounty-programme/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/bug.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Bug Bounty Programme</span><span className="nav-card__desc">Help strengthen Zetrix and earn rewards.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                </div>
              </section>

              <section className="nav-panel__group" id="nav-group-individuals" data-nav-group="individuals" data-nav-count="1">
                <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="individuals" aria-controls="nav-group-individuals-content" aria-expanded="false"><span>Individuals</span><span className="caret" aria-hidden="true"></span></button>
                <div className="nav-panel__content" id="nav-group-individuals-content" data-nav-group-content>
                  <a className="nav-card" href="https://www.zetrix.com/zetrix-wallet/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/wallet-cards.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Zetrix Wallet</span><span className="nav-card__desc">Manage assets and access the Zetrix ecosystem.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                </div>
              </section>

              <section className="nav-panel__group" id="nav-group-ecosystem" data-nav-group="ecosystem" data-nav-count="6">
                <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="ecosystem" aria-controls="nav-group-ecosystem-content" aria-expanded="false"><span>Ecosystem</span><span className="caret" aria-hidden="true"></span></button>
                <div className="nav-panel__content" id="nav-group-ecosystem-content" data-nav-group-content>
                  <a className="nav-card" href="https://www.zetrix.com/zetrix-ecosystems/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/blocks.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Zetrix Ecosystem</span><span className="nav-card__desc">Explore applications and partners built on Zetrix.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/robotics/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/bot.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Zetrix Robotics</span><span className="nav-card__desc">Discover intelligent automation solutions.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/zetrix-avatar/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/scan-face.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Zetrix Avatar</span><span className="nav-card__desc">Explore Zetrix-powered digital identity experiences.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/asean-china-ai-lab/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/brain-circuit.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">AI</span><span className="nav-card__desc">Discover the ASEAN–China AI Lab.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/global-accelerator-programme/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/rocket.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Accelerator</span><span className="nav-card__desc">Grow Web3 ideas with global support.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/miss-universe-voting/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/vote.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Use Case: Voting</span><span className="nav-card__desc">See blockchain-powered transparent voting.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                </div>
              </section>

              <section className="nav-panel__group" id="nav-group-tools" data-nav-group="tools" data-nav-count="3">
                <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="tools" aria-controls="nav-group-tools-content" aria-expanded="false"><span>Tools</span><span className="caret" aria-hidden="true"></span></button>
                <div className="nav-panel__content" id="nav-group-tools-content" data-nav-group-content>
                  <a className="nav-card" href="https://explorer.zetrix.com/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/search-code.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Block Explorer</span><span className="nav-card__desc">Inspect blocks, transactions, and accounts.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://ds.zetrix.com/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/activity.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Node Monitor</span><span className="nav-card__desc">Monitor Zetrix network node performance.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://ide.zetrix.com/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/file-code-2.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Smart Contract</span><span className="nav-card__desc">Build and deploy smart contracts.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                </div>
              </section>

              <section className="nav-panel__group" id="nav-group-discover" data-nav-group="discover" data-nav-count="4">
                <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="discover" aria-controls="nav-group-discover-content" aria-expanded="false"><span>Discover</span><span className="caret" aria-hidden="true"></span></button>
                <div className="nav-panel__content" id="nav-group-discover-content" data-nav-group-content>
                  <a className="nav-card" href="https://www.zetrix.com/about-zetrix/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/badge-info.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">About Zetrix</span><span className="nav-card__desc">Learn about the Zetrix public blockchain.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/media-and-community/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/users-round.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Media and community</span><span className="nav-card__desc">Connect with Zetrix news and communities.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/blog/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/newspaper.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Blog</span><span className="nav-card__desc">Read insights, updates, and announcements.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/jobs/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/briefcase-business.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Careers</span><span className="nav-card__desc">Build the future of trust with Zetrix.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                </div>
              </section>

              <section className="nav-panel__group" id="nav-group-investors" data-nav-group="investors" data-nav-count="9">
                <button className="nav-panel__accordion" type="button" data-nav-accordion-trigger="investors" aria-controls="nav-group-investors-content" aria-expanded="false"><span>Investors</span><span className="caret" aria-hidden="true"></span></button>
                <div className="nav-panel__content" id="nav-group-investors-content" data-nav-group-content>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/landmark.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Investor Relations</span><span className="nav-card__desc">Access the investor information centre.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/corporate-information/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/building-2.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Corporate Information</span><span className="nav-card__desc">Review company and leadership information.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/financials/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/chart-no-axes-combined.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Financials</span><span className="nav-card__desc">View financial results and disclosures.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/stock-info/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/chart-candlestick.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Stock Information</span><span className="nav-card__desc">Review current stock-related information.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/governance/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/scale.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Corporate Governance</span><span className="nav-card__desc">Explore governance policies and practices.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/general-meetings/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/users-round.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">General Meetings</span><span className="nav-card__desc">Find notices and meeting materials.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/news/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/newspaper.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">News</span><span className="nav-card__desc">Read the latest investor news.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/reports-presentations/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/presentation.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">Reports &amp; Presentations</span><span className="nav-card__desc">Access reports and presentation materials.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                  <a className="nav-card" href="https://www.zetrix.com/investor-relations/news-alerts/"><span className="nav-card__icon"><img loading="lazy" decoding="async" src="/assets/icons/lucide/bell-ring.svg" alt="" aria-hidden="true" /></span><span className="nav-card__copy"><span className="nav-card__title">News Alerts</span><span className="nav-card__desc">Subscribe to investor news alerts.</span></span><span className="nav-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span></a>
                </div>
              </section>

              <div className="nav-dropdown__theme">
                <span className="nav-dropdown__theme-label">Appearance</span>
                <button className="theme-toggle nav-dropdown__theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to light mode" title="Switch to light mode">
                  <span className="theme-toggle__track" aria-hidden="true"><span className="theme-toggle__orb"></span></span>
                </button>
              </div>
            </div>
          </div>

          <noscript>
            <style dangerouslySetInnerHTML={{ __html: `
              .nav-dropdown { opacity: 1 !important; visibility: visible !important; transform: none !important; pointer-events: auto !important; }
              .nav-dropdown__surface { height: auto !important; max-height: calc(100svh - 112px); overflow-y: auto; }
              .nav-panel__group { display: block !important; margin-bottom: 12px; }
              .nav-panel__accordion { display: flex !important; }
            ` }} />
          </noscript>
        </nav>
      </header>

      <main>
        {/* ============================= HERO ============================= */}
        <section className="hero">
          <div className="hero__aurora" aria-hidden="true"></div>
          <div className="hero__content">
            <h1 className="hero__title hero__reveal">From Trusted<br />Infrastructure to<br />Intelligent Machines</h1>
            <p className="hero__subtitle hero__reveal">Build trust and transparency with a scalable public blockchain designed for Public Sectors, Enterprises and Financial institutions.</p>
            <a className="btn btn--red hero__cta hero__reveal" href="#">Get Started</a>
          </div>
          <div className="hero__globe" id="hero-globe" aria-hidden="true">
            {/* Three.js globe renders here */}
          </div>
        </section>

        <div className="ribbon-story" data-ribbon-story>
          {/* ===================== ONE ECOSYSTEM ===================== */}
          <section className="ecosystem">
            <div className="eco-track" id="eco-track">
              <div className="eco-pin">
                <div className="eco-card" data-eco-carousel>
                  <img loading="lazy" decoding="async" className="eco-card__bg" src="/assets/img/ecosystem-card-bg.webp" alt="" aria-hidden="true" />
                  <div className="eco-card__left">
                    <h2 className="section-heading">One ecosystem.<br />Built on open standards.</h2>
                    <p className="eco-card__sub">The core primitives for building trusted, decentralised applications on Zetrix.</p>
                  </div>

                  <div className="eco-stack" id="eco-stack">
                    <article className="eco-fcard" data-eco-card>
                      <button className="eco-fcard__head" type="button" aria-expanded="false">
                        <h3 className="eco-fcard__title">Smart Contract Integrated Development Environment (IDE)</h3>
                        <p className="eco-fcard__desc">Create, execute and manage smart contracts seamlessly with Node.JS, Java and GO.</p>
                      </button>
                      <div className="eco-fcard__panel">
                        <div className="node-panel node-panel--smart-contract">
                          <picture className="node-illus-theme node-illus-theme--dark">
                            <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/img/IDE-reduced-motion.webp" />
                            <img loading="lazy" decoding="async" className="node-illus node-illus--smart-contract" src="/assets/img/IDE.webp" width="480" height="270" alt="" aria-hidden="true" />
                          </picture>
                          <picture className="node-illus-theme node-illus-theme--light">
                            <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/img/IDE-reduced-motion-light.webp" />
                            <img loading="lazy" decoding="async" className="node-illus node-illus--smart-contract" src="/assets/img/IDE-light.webp" width="480" height="270" alt="" aria-hidden="true" />
                          </picture>
                        </div>
                      </div>
                    </article>

                    <article className="eco-fcard" data-eco-card>
                      <button className="eco-fcard__head" type="button" aria-expanded="false">
                        <h3 className="eco-fcard__title">Decentralised Identifiers based on W3C standards</h3>
                        <p className="eco-fcard__desc">A secure, privacy-preserving method for managing digital identities with user control, based on W3C standards.</p>
                      </button>
                      <div className="eco-fcard__panel">
                        <div className="node-panel node-panel--w3c-identifiers">
                          <picture className="node-illus-theme node-illus-theme--dark">
                            <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/img/decentralised-identifiers-reduced-motion.webp" />
                            <img loading="lazy" decoding="async" className="node-illus node-illus--w3c-identifiers" src="/assets/img/decentralised-identifiers.webp" width="480" height="270" alt="" aria-hidden="true" />
                          </picture>
                          <picture className="node-illus-theme node-illus-theme--light">
                            <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/img/decentralised-identifiers-reduced-motion-light.webp" />
                            <img loading="lazy" decoding="async" className="node-illus node-illus--w3c-identifiers" src="/assets/img/decentralised-identifiers-light.webp" width="480" height="270" alt="" aria-hidden="true" />
                          </picture>
                        </div>
                      </div>
                    </article>

                    <article className="eco-fcard" data-eco-card>
                      <button className="eco-fcard__head" type="button" aria-expanded="false">
                        <h3 className="eco-fcard__title">Verifiable Credentials</h3>
                        <p className="eco-fcard__desc">Securely present and verify credentials in an interoperable manner with Self-Sovereign Identity (SSI).</p>
                      </button>
                      <div className="eco-fcard__panel">
                        <div className="node-panel node-panel--verifiable-credential">
                          <picture className="node-illus-theme node-illus-theme--dark">
                            <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/img/verifiable-credential-reduced-motion.webp" />
                            <img loading="lazy" decoding="async" className="node-illus node-illus--verifiable-credential" src="/assets/img/verifiable-credential.webp" width="480" height="270" alt="" aria-hidden="true" />
                          </picture>
                          <picture className="node-illus-theme node-illus-theme--light">
                            <source media="(prefers-reduced-motion: reduce)" srcSet="/assets/img/verifiable-credential-reduced-motion-light.webp" />
                            <img loading="lazy" decoding="async" className="node-illus node-illus--verifiable-credential" src="/assets/img/verifiable-credential-light.webp" width="480" height="270" alt="" aria-hidden="true" />
                          </picture>
                        </div>
                      </div>
                    </article>
                  </div>
                  <div className="eco-controls" aria-label="Ecosystem primitives">
                    <button className="eco-btn" id="eco-prev" type="button" aria-label="Previous primitive" disabled>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <span className="eco-progress" aria-hidden="true"><i className="is-active"></i><i></i><i></i></span>
                    <span className="eco-status" id="eco-status" aria-live="polite" aria-atomic="true">01 / 03</span>
                    <button className="eco-btn" id="eco-next" type="button" aria-label="Next primitive">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="ribbon-flow" data-ribbon-flow>
            <img loading="lazy" decoding="async" className="ribbon-flow__mobile" src="/assets/ribbon/zetrix-mobile-ribbon.svg" alt="" aria-hidden="true" />
            <svg className="ribbon-flow__visual" viewBox="0 0 1185.65 3200.02" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="ribbon-flow-gradient" x1="592.809" y1="100.008" x2="592.809" y2="3100.01" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E4222E" stopOpacity="0" />
                  <stop offset="0.09" stopColor="#E4222E" stopOpacity="0.95" />
                  <stop offset="0.5" stopColor="#C5242E" />
                  <stop offset="0.91" stopColor="#E4222E" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#E4222E" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ribbon-flow-head-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="1" stopColor="#000" />
                </linearGradient>
                <mask id="ribbon-flow-edge-mask" maskUnits="userSpaceOnUse" x="-180" y="0" width="1545.65" height="3200.02" style={{ maskType: "luminance" }}>
                  <rect x="-180" y="0" width="1545.65" height="3200.02" fill="#000" />
                  <rect className="ribbon-flow__reveal-body" x="-180" y="0" width="1545.65" height="0" fill="#fff" />
                  <rect className="ribbon-flow__reveal-edge" x="-180" y="0" width="1545.65" height="0" fill="url(#ribbon-flow-head-fade)" />
                </mask>
              </defs>
              <path className="ribbon-flow__path" opacity="1" vectorEffect="non-scaling-stroke" strokeDasharray="none" d="M500.04 100.008C596.64 236.708 1146.64 646.708 1080.04 920.008C1013.34 1193.31 106.64 1503.31 100.04 1740.01C93.3402 1976.71 956.64 2113.31 1040.04 2340.01C1123.34 2566.71 673.34 2973.31 600.04 3100.01" stroke="url(#ribbon-flow-gradient)" strokeWidth="360" strokeLinecap="round" strokeLinejoin="round" fill="none" mask="url(#ribbon-flow-edge-mask)" />
            </svg>

            {/* ===================== ZETRIX-POWERED TOOLS ===================== */}
            <section className="tools" data-tools-track>
              <div className="tools__pin">
                <img loading="lazy" decoding="async" className="tools__section-frame" src="/assets/tools-art/tools-section-frame.svg" alt="" aria-hidden="true" />
                <div className="tools__inner">
                  <div className="tools__left">
                    <h2 className="section-heading">Zetrix-powered tools and services</h2>
                    <p className="tools__sub">Real applications built on Zetrix — for identity, credentials, and cross-border trade.</p>

                    <div className="tool-grid">
                      <article className="tool-card">
                        <div className="tool-card__top">
                          <span className="tool-card__icon" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/lucide-fingerprint.svg" alt="" /></span>
                          <span className="tool-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span>
                        </div>
                        <div className="tool-card__text">
                          <h3 className="tool-card__title">ZID</h3>
                          <p className="tool-card__desc">Privacy-preserving digital identity.</p>
                        </div>
                      </article>

                      <article className="tool-card">
                        <div className="tool-card__top">
                          <span className="tool-card__icon" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/lucide-badge-check.svg" alt="" /></span>
                          <span className="tool-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span>
                        </div>
                        <div className="tool-card__text">
                          <h3 className="tool-card__title">ZCert</h3>
                          <p className="tool-card__desc">Issue and verify tamper-evident credentials.</p>
                        </div>
                      </article>

                      <article className="tool-card">
                        <div className="tool-card__top">
                          <span className="tool-card__icon" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/lucide-scroll-text.svg" alt="" /></span>
                          <span className="tool-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span>
                        </div>
                        <div className="tool-card__text">
                          <h3 className="tool-card__title">ZTrade</h3>
                          <p className="tool-card__desc">Digitise and verify cross-border trade documentation.</p>
                        </div>
                      </article>

                      <article className="tool-card">
                        <div className="tool-card__top">
                          <span className="tool-card__icon" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/lucide-banknote.svg" alt="" /></span>
                          <span className="tool-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span>
                        </div>
                        <div className="tool-card__text">
                          <h3 className="tool-card__title">ZTradeFi</h3>
                          <p className="tool-card__desc">Connect trusted trade data with financing workflows.</p>
                        </div>
                      </article>

                      <article className="tool-card">
                        <div className="tool-card__top">
                          <span className="tool-card__icon" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/lucide-coins.svg" alt="" /></span>
                          <span className="tool-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span>
                        </div>
                        <div className="tool-card__text">
                          <h3 className="tool-card__title">ZEFi</h3>
                          <p className="tool-card__desc">Stake ZETRIX and participate in the network.</p>
                        </div>
                      </article>

                      <article className="tool-card">
                        <div className="tool-card__top">
                          <span className="tool-card__icon" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/lucide-wallet.svg" alt="" /></span>
                          <span className="tool-card__arrow" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" /></span>
                        </div>
                        <div className="tool-card__text">
                          <h3 className="tool-card__title">Zetrix Wallet</h3>
                          <p className="tool-card__desc">Manage assets, credentials, and decentralised applications.</p>
                        </div>
                      </article>
                    </div>
                  </div>

                  <div className="tools__art" data-tools-art aria-hidden="true">
                    <img loading="lazy" decoding="async" className="tools__art-layer tools__art-particles" src="/assets/tools-art/tools-art-particles.svg" alt="" />
                    <img loading="lazy" decoding="async" className="tools__art-layer tools__art-small-cubes" src="/assets/tools-art/tools-art-small-cubes.svg" alt="" />
                    <img loading="lazy" decoding="async" className="tools__art-layer tools__art-ticks" src="/assets/tools-art/tools-art-ticks.svg" alt="" />
                    <img loading="lazy" decoding="async" className="tools__art-layer tools__art-connectors" src="/assets/tools-art/tools-art-connectors.svg" alt="" />

                    <img loading="lazy" decoding="async" className="tools__cube tools__cube--bottom" data-tools-cube="bottom" src="/assets/tools-art/tools-blockchain-cube.webp" alt="" />
                    <img loading="lazy" decoding="async" className="tools__cube tools__cube--centre" data-tools-cube="centre" src="/assets/tools-art/tools-blockchain-cube.webp" alt="" />
                    <img loading="lazy" decoding="async" className="tools__cube tools__cube--top" data-tools-cube="top" src="/assets/tools-art/tools-blockchain-cube.webp" alt="" />
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== INTELLIGENCE GROUNDED IN IDENTITY ===================== */}
            <section className="ai-layer" data-ai-ribbon-track>
              <div className="ai-layer__pin">
                <div className="ai-layer__backdrop" aria-hidden="true">
                  <img loading="lazy" decoding="async" className="ai-layer__frame" src="/assets/tools-art/tools-section-frame.svg" alt="" />
                  <img loading="lazy" decoding="async" className="ai-layer__particles" src="/assets/tools-art/tools-art-particles.svg" alt="" />
                </div>

                <div className="ai-layer__inner">
                  <h2 className="section-heading section-heading--center"><span className="ai-heading__line">Intelligence grounded in</span><br className="ai-heading__break ai-heading__break--mobile" /> <span className="ai-heading__line">identity</span><br className="ai-heading__break ai-heading__break--desktop" /> <span className="ai-heading__line">and values.</span></h2>

                  <div className="ai-cards">
                    <article className="ai-card">
                      <div className="ai-card__media ai-card__media--nurai">
                        <div className="ai-card__media-stage">
                          <img loading="lazy" decoding="async" className="ai-card__base-image" src="/assets/img/ai-nurai-illustration.webp" width="1080" height="680" alt="NurAI product preview" />
                        </div>
                      </div>
                      <div className="ai-card__body">
                        <h3 className="ai-card__title">The World’s First Shariah-Aligned Intelligence Model</h3>
                        <p className="ai-card__desc">A Shariah-aligned, multilingual AI foundation for culturally , and institutionally relevant services.</p>
                        <a className="btn btn--red ai-card__cta" href="https://nur-ai.ai/" target="_blank" rel="noopener noreferrer" aria-label="Know more about NurAI">Know more <span className="arrow-ext" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg></span></a>
                      </div>
                    </article>

                    <article className="ai-card">
                      <div className="ai-card__media ai-card__media--avatar">
                        <div className="ai-card__media-stage">
                          <img loading="lazy" decoding="async" className="ai-card__base-image" src="/assets/img/ai-avatar-illustration.webp" width="1080" height="680" alt="Avatar agent product preview" />
                        </div>
                      </div>
                      <div className="ai-card__body">
                        <h3 className="ai-card__title">Your Agentic Twin</h3>
                        <p className="ai-card__desc">An AI agent with verified identity that can represent users or organisations and execute approved tasks.</p>
                        <a className="btn btn--red ai-card__cta" href="https://avatar.inc/" target="_blank" rel="noopener noreferrer" aria-label="Know more about Avatar">Know more <span className="arrow-ext" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg></span></a>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== INTELLIGENCE MOVES INTO THE REAL WORLD ===================== */}
            <section className="robotics">
              <div className="robotics__pin" data-robotics-carousel>
                <div className="robotics__inner">
                  <header className="robotics__heading">
                    <h2 className="section-heading section-heading--center robotics__title">Intelligence moves into the real world.</h2>
                    <p className="section-sub section-sub--center robotics__subtitle">Humanoid and autonomous robotics bring intelligent automation into research, services, facilities, and industrial operations.</p>
                  </header>

                  <div className="robot-cards">
                    <article className="robot-card">
                      <img loading="lazy" decoding="async" className="robot-card__image" src="/assets/img/robotics-pm01.webp" alt="PM01 humanoid robot" />
                      <div className="robot-card__caption">
                        <div className="robot-card__meta"><span>01</span><img loading="lazy" decoding="async" className="robot-card__arrow" src="/assets/icons/arrow-up-right.svg" alt="" aria-hidden="true" /></div>
                        <h3 className="robot-card__title">PM01</h3>
                        <p className="robot-card__desc">An agile humanoid platform for development, research, and embodied-AI experiences.</p>
                      </div>
                    </article>
                    <article className="robot-card">
                      <img loading="lazy" decoding="async" className="robot-card__image" src="/assets/img/robotics-leju-kuavo.webp" alt="Leju Kuavo humanoid robot" />
                      <div className="robot-card__caption">
                        <div className="robot-card__meta"><span>02</span><img loading="lazy" decoding="async" className="robot-card__arrow" src="/assets/icons/arrow-up-right.svg" alt="" aria-hidden="true" /></div>
                        <h3 className="robot-card__title">Leju Kuavo</h3>
                        <p className="robot-card__desc">A humanoid robotics platform for embodied intelligence and real-world applications.</p>
                      </div>
                    </article>
                    <article className="robot-card">
                      <img loading="lazy" decoding="async" className="robot-card__image" src="/assets/img/robotics-gausium.webp" alt="Gausium autonomous cleaning robots" />
                      <div className="robot-card__caption">
                        <div className="robot-card__meta"><span>03</span><img loading="lazy" decoding="async" className="robot-card__arrow" src="/assets/icons/arrow-up-right.svg" alt="" aria-hidden="true" /></div>
                        <h3 className="robot-card__title">Gausium</h3>
                        <p className="robot-card__desc">Autonomous cleaning robots for commercial and industrial facilities.</p>
                      </div>
                    </article>
                  </div>
                  <div className="robotics__controls" aria-label="Robotics products">
                    <button className="robotics__btn" id="robotics-prev" type="button" aria-label="Previous robotics product" disabled>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <span className="robotics__progress" aria-hidden="true"><i className="is-active"></i><i></i><i></i></span>
                    <span className="robotics__status" id="robotics-status" aria-live="polite" aria-atomic="true">01 / 03</span>
                    <button className="robotics__btn" id="robotics-next" type="button" aria-label="Next robotics product">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              <p className="fig-note">Fig. 5 — Robotics layer</p>
            </section>
          </div>
        </div>

        {/* ===================== BLOCKCHAIN PROVES / CTA HANDOFF ===================== */}
        <div className="layers-cta-handoff" data-layers-handoff>
          <section className="layers-track" aria-labelledby="layers-title">
            <div className="layers__pin" id="connected-ecosystem">
              <div className="layers__inner">
                <header className="layers__heading">
                  <h2 className="section-heading section-heading--center" id="layers-title"><span className="layers__title-line">Blockchain proves.</span> <span className="layers__title-line">AI decides.</span><br className="layers__title-break" /><span className="layers__title-line">Robotics acts.</span></h2>
                  <p className="section-sub section-sub--center">Three layers of one Zetrix ecosystem—turning trusted data into intelligent decisions and intelligent decisions into measurable action.</p>
                </header>

                <div className="carousel" data-carousel>
                  <div className="carousel__stack">
                    <article className="carousel__card" data-slide-index="0">
                      <img loading="lazy" decoding="async" src="/assets/img/connected-ecosystem-blockchain.webp" width="1672" height="941" alt="Blockchain identity and verification layer" />
                    </article>
                    <article className="carousel__card" data-slide-index="1">
                      <img loading="lazy" decoding="async" src="/assets/img/connected-ecosystem-ai.webp" width="1672" height="941" alt="AI intelligence and decision layer" />
                    </article>
                    <article className="carousel__card" data-slide-index="2">
                      <img loading="lazy" decoding="async" src="/assets/img/connected-ecosystem-robotics.webp" width="1672" height="941" alt="Robotics execution layer" />
                    </article>
                  </div>

                  <div className="carousel__foot">
                    <div className="carousel__text" id="carousel-status" aria-live="polite" aria-atomic="true">
                      <h3 className="carousel__title">Blockchain</h3>
                      <p className="carousel__desc">Verifies identity, credentials, ownership, and transactions.</p>
                    </div>
                    <div className="carousel__controls" aria-label="Ecosystem layers">
                      <button className="carousel__btn" id="carousel-prev" type="button" aria-label="Previous ecosystem layer" disabled>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                      </button>
                      <span className="carousel__progress" aria-hidden="true"><i className="is-active"></i><i></i><i></i></span>
                      <button className="carousel__btn" id="carousel-next" type="button" aria-label="Next ecosystem layer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== #BUIDLREAL CTA ===================== */}
          <section className="cta">
            <div className="cta__panel">
              <img loading="lazy" decoding="async" className="cta__backdrop" src="/assets/img/cta-buidlreal.webp" alt="" aria-hidden="true" />
              <div className="cta__content">
                <h2 className="cta__title">#BUIDLREAL on Zetrix</h2>
                <p className="cta__desc">Explore enterprise solutions or build directly on Zetrix — the network for digital trust, intelligent systems, and real-world automation.</p>
                <div className="cta__actions">
                  <a className="btn btn--red cta__btn" href="#">Get Started</a>
                  <a className="btn btn--outline cta__btn" href="#">Contact the team</a>
                </div>
              </div>
            </div>

            <div className="partners" aria-label="Partner of our AI Lab">
              <p className="partners__label">Partner of our AI Lab</p>
              <div className="partners__marquee">
                <div className="partners__track">
                  <span className="partner-pill partner-pill--crest"><img loading="lazy" decoding="async" src="/assets/partners/beihang.webp" alt="Beihang University" /></span>
                  <span className="partner-pill"><img loading="lazy" decoding="async" src="/assets/partners/alibaba-cloud.svg" alt="Alibaba Cloud" /></span>
                  <span className="partner-pill"><img loading="lazy" decoding="async" src="/assets/partners/deepseek.svg" alt="DeepSeek" /></span>
                  <span className="partner-pill"><img loading="lazy" decoding="async" src="/assets/partners/dji.webp" alt="DJI" /></span>
                  <span className="partner-pill"><img loading="lazy" decoding="async" src="/assets/partners/huawei.svg" alt="Huawei" /></span>
                  <span className="partner-pill"><img loading="lazy" decoding="async" src="/assets/partners/leju.webp" alt="Leju Robot" /></span>
                  <span className="partner-pill"><img loading="lazy" decoding="async" src="/assets/partners/raisound.webp" alt="Raisound" /></span>
                  <span className="partner-pill"><img loading="lazy" decoding="async" src="/assets/partners/speakly-ai.webp" alt="Speakly AI" /></span>
                  <span className="partner-pill partner-pill--crest" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/beihang.webp" alt="" /></span>
                  <span className="partner-pill" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/alibaba-cloud.svg" alt="" /></span>
                  <span className="partner-pill" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/deepseek.svg" alt="" /></span>
                  <span className="partner-pill" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/dji.webp" alt="" /></span>
                  <span className="partner-pill" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/huawei.svg" alt="" /></span>
                  <span className="partner-pill" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/leju.webp" alt="" /></span>
                  <span className="partner-pill" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/raisound.webp" alt="" /></span>
                  <span className="partner-pill" aria-hidden="true"><img loading="lazy" decoding="async" src="/assets/partners/speakly-ai.webp" alt="" /></span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================== FOOTER ===================== */}
        <footer className="footer">
          <div className="footer__inner">
            <div className="footer__top">
              <nav className="footer__nav" aria-label="Footer">
                <div className="footer__col">
                  <h4 className="footer__head">Product</h4>
                  <a href="#">#BUIDL With Zetrix</a>
                  <a href="#">Bug Bounty Programme</a>
                </div>
                <div className="footer__col">
                  <h4 className="footer__head">Individuals</h4>
                  <a href="#">Zetrix Wallet</a>
                </div>
                <div className="footer__col">
                  <h4 className="footer__head">Ecosystem</h4>
                  <a href="#">Zetrix Ecosystem</a>
                  <a href="#">Accelerator</a>
                </div>
                <div className="footer__col">
                  <h4 className="footer__head">Tools</h4>
                  <a href="#">Node Monitor</a>
                  <a href="#">Block Explorer</a>
                  <a href="#">Smart Contract</a>
                </div>
                <div className="footer__col">
                  <h4 className="footer__head">Discover</h4>
                  <a href="#">About Zetrix</a>
                  <a href="#">Media and community</a>
                  <a href="#">Careers</a>
                </div>
              </nav>
              <div className="footer__socials" aria-label="Zetrix social channels">
                <a href="#" aria-label="Telegram" className="social"><img loading="lazy" decoding="async" src="/assets/footer/telegram.svg" alt="" /></a>
                <a href="#" aria-label="Discord" className="social"><img loading="lazy" decoding="async" src="/assets/footer/discord.svg" alt="" /></a>
                <a href="#" aria-label="X" className="social"><img loading="lazy" decoding="async" src="/assets/footer/x.svg" alt="" /></a>
                <a href="#" aria-label="TikTok" className="social"><img loading="lazy" decoding="async" src="/assets/footer/tiktok.svg" alt="" /></a>
              </div>
            </div>

            <div className="footer__brand">
              <div className="footer__wordmark-art" data-footer-spotlight aria-hidden="true">
                <img loading="lazy" decoding="async" className="footer__wordmark-base" src="/assets/footer/zetrix-wordmark-fill.svg" alt="" />
                <img loading="lazy" decoding="async" className="footer__wordmark-color-trail footer__wordmark--dark" src="/assets/footer/zetrix-wordmark-fill.svg" alt="" />
                <img loading="lazy" decoding="async" className="footer__wordmark-spotlight footer__wordmark--dark" src="/assets/footer/zetrix-wordmark-fill.svg" alt="" />
                <img loading="lazy" decoding="async" className="footer__wordmark-color-trail footer__wordmark--light" src="/assets/footer/zetrix-wordmark-fill-light.svg" alt="" />
                <img loading="lazy" decoding="async" className="footer__wordmark-spotlight footer__wordmark--light" src="/assets/footer/zetrix-wordmark-fill-light.svg" alt="" />
              </div>
              <div className="footer__bottom">
                <p className="footer__copy">© 2026 Zetrix. All rights reserved.</p>
                <div className="footer__legal">
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
