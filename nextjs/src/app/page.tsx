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
          <img className="site-intro__mark site-intro__mark--nav site-intro__mark--nav-dark" src="/assets/img/logo-zetrix.svg" alt="" />
          <img className="site-intro__mark site-intro__mark--nav site-intro__mark--nav-light" src="/assets/img/logo-zetrix-light.svg" alt="" />
        </div>
      </div>

      {/* ============================= NAV ============================= */}
      <header className="nav-wrap">
        <button className="nav__backdrop" type="button" data-nav-backdrop hidden aria-label="Close navigation menu"></button>

        <nav className="nav" data-nav aria-label="Primary">
          <a className="nav__logo" href="/" aria-label="Zetrix home">
            <img className="nav__logo-mark nav__logo-mark--dark" src="/assets/img/logo-zetrix.svg" alt="Zetrix" />
            <img className="nav__logo-mark nav__logo-mark--light" src="/assets/img/logo-zetrix-light.svg" alt="" aria-hidden="true" />
          </a>

          <ul className="nav__menu">
            <li><button className="nav__link" type="button" data-nav-trigger="developers" aria-controls="nav-group-developers" aria-expanded="false">Developers <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="individuals" aria-controls="nav-group-individuals" aria-expanded="false">Individuals <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="ecosystem" aria-controls="nav-group-ecosystem" aria-expanded="false">Ecosystem <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="tools" aria-controls="nav-group-tools" aria-expanded="false">Tools <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="discover" aria-controls="nav-group-discover" aria-expanded="false">Discover <span className="caret" aria-hidden="true"></span></button></li>
            <li><button className="nav__link" type="button" data-nav-trigger="investors" aria-controls="nav-group-investors" aria-expanded="false">Investors <span className="caret" aria-hidden="true"></span></button></li>
          </ul>

          <a className="btn btn--red nav__cta" href="https://www.zetrix.com/buidl-zetrix/">BUIDL Now</a>

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
          {/* Scroll-driven grid ribbon (right edge, Sections 2–5). Canvas engine: /js/grid-ribbon.js */}
          <canvas className="grid-ribbon" data-grid-ribbon aria-hidden="true"></canvas>
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

                    <img loading="lazy" decoding="async" className="tools__cube tools__cube--bottom" data-tools-cube="bottom" src="/assets/tools-art/tools-blockchain-cube.webp" alt="" />
                    <img loading="lazy" decoding="async" className="tools__cube tools__cube--centre" data-tools-cube="centre" src="/assets/tools-art/tools-blockchain-cube.webp" alt="" />
                    <img loading="lazy" decoding="async" className="tools__cube tools__cube--top" data-tools-cube="top" src="/assets/tools-art/tools-blockchain-cube.webp" alt="" />
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== AI INTRO (title + partners) ===================== */}
            <section className="ai-intro" data-ai-intro>
              <div className="ai-intro__inner">
                <div className="ai-intro__lead">
                  <h2 className="section-heading ai-intro__title"><span className="ai-intro__title-line">Intelligence grounded in identity and values.</span></h2>
                </div>
                <div className="ai-intro__partners">
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
                </div>
              </div>
            </section>

            {/* ===================== YOUR AGENTIC TWIN ===================== */}
            {/* The grid-ribbon canvas morphs into a red-tile mascot on the right
                (>=1024px). Below that the canvas is hidden, so .agentic__mascot
                shows the illustration as the fallback. */}
            <section className="ai-layer agentic-section" data-ai-ribbon-track>
              <div className="ai-layer__pin">
                <div className="ai-layer__inner agentic">
                  <div className="agentic__text">
                    <h2 className="section-heading agentic__title"><span className="agentic__title-line">Your Agentic Twin</span></h2>
                    <p className="agentic__sub">An AI agent with verified identity that can represent users or organisations and execute approved tasks.</p>
                    <a className="btn btn--red agentic__cta" href="https://avatar.inc/" target="_blank" rel="noopener noreferrer" aria-label="Know more about your Agentic Twin">Know more <span className="arrow-ext" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg></span></a>

                    {/* Selling points — avatar.inc's four focused capabilities. Same
                        card treatment as the Tools section; icons are inline Lucide. */}
                    <div className="sp-grid">
                      <article className="sp-card">
                        <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" /></svg></span>
                        <h3 className="sp-card__title">Work on autopilot</h3>
                        <p className="sp-card__desc">Assign your Avatar to handle conversations, run workflows, and stay consistent.</p>
                      </article>
                      <article className="sp-card">
                        <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></svg></span>
                        <h3 className="sp-card__title">An agent you trust</h3>
                        <p className="sp-card__desc">Operate in trust-critical environments, with accountability built in.</p>
                      </article>
                      <article className="sp-card">
                        <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v5" /><path d="M16 14.639V21" /><path d="M20 10.656V21" /><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" /><path d="M4 18.463V21" /><path d="M8 14.656V21" /></svg></span>
                        <h3 className="sp-card__title">Scale your operations</h3>
                        <p className="sp-card__desc">Run simultaneous interactions and repeatable workflows through one identity.</p>
                      </article>
                      <article className="sp-card">
                        <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></svg></span>
                        <h3 className="sp-card__title">Verifiable identity</h3>
                        <p className="sp-card__desc">Verified identity, secure data, and trusted autonomous execution.</p>
                      </article>
                    </div>
                  </div>
                  <div className="agentic__art" aria-hidden="true">
                    <img loading="lazy" decoding="async" className="agentic__mascot" src="/assets/img/ai-avatar-illustration.webp" width="1080" height="680" alt="" />
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== NURAI ===================== */}
            {/* Same two-column treatment as the Agentic Twin: copy on the left,
                illustration on the right. */}
            <section className="nurai" data-nurai>
              <div className="nurai__inner">
                <div className="nurai__text">
                  <h2 className="section-heading nurai__title"><span className="nurai__title-line">The World’s First Shariah-Aligned Intelligence Model</span></h2>
                  <p className="nurai__sub">A Shariah-aligned, multilingual AI foundation for culturally, and institutionally relevant services.</p>
                  <a className="btn btn--red nurai__cta" href="https://nur-ai.ai/" target="_blank" rel="noopener noreferrer" aria-label="Know more about NurAI">Know more <span className="arrow-ext" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg></span></a>

                  {/* Selling points — NurAI's core value propositions (nur-ai.ai).
                      Same card treatment as the Tools section; inline Lucide icons. */}
                  <div className="sp-grid">
                    <article className="sp-card">
                      <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 18v-7" /><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" /></svg></span>
                      <h3 className="sp-card__title">Quran &amp; Sunnah rooted</h3>
                      <p className="sp-card__desc">Grounded in Islamic teachings at its core, not treated as an add-on.</p>
                    </article>
                    <article className="sp-card">
                      <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18" /><path d="m19 8 3 8a5 5 0 0 1-6 0zV7" /><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" /><path d="m5 8 3 8a5 5 0 0 1-6 0zV7" /><path d="M7 21h10" /></svg></span>
                      <h3 className="sp-card__title">Scholar-validated</h3>
                      <p className="sp-card__desc">Guidance reviewed by Islamic legal experts worldwide for doctrinal accuracy.</p>
                    </article>
                    <article className="sp-card">
                      <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></svg></span>
                      <h3 className="sp-card__title">Culturally localised</h3>
                      <p className="sp-card__desc">Region-specific, multilingual answers aligned with JAKIM and local context.</p>
                    </article>
                    <article className="sp-card">
                      <span className="sp-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><line x1="12" x2="12" y1="16" y2="12" /><line x1="12" x2="12.01" y1="8" y2="8" /></svg></span>
                      <h3 className="sp-card__title">Transparent sourcing</h3>
                      <p className="sp-card__desc">Referenced answers drawn from hadith and fatwa sources you can verify.</p>
                    </article>
                  </div>
                </div>
                <div className="nurai__art" aria-hidden="true">
                  {/* Desktop (>=1024px): the grid-ribbon canvas morphs into the NurAI
                      logo here. Below that the canvas is hidden, so this SVG (the real
                      brand logo) is the fallback. */}
                  <svg className="nurai__logo" viewBox="0 0 811 645" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M649.172 116.17C686.444 107.41 728.644 110.857 760.39 110.857C788.005 110.858 810.39 133.243 810.39 160.857C810.39 188.472 788.005 210.857 760.39 210.857C715.137 210.857 694.306 208.286 672.051 213.517C655.726 217.353 636.826 226.497 610.632 259.781C600.981 272.044 592.748 295.417 585.893 333.538C582.645 351.604 580.005 370.956 577.248 391.653C574.543 411.963 571.714 433.67 568.196 454.718C561.383 495.486 550.939 541.42 527.954 577.603C515.953 596.494 499.848 613.886 478.151 626.261C456.275 638.739 431.427 644.561 404.456 644.21C335.033 643.305 298.951 590.752 279.83 544.139C260.635 497.346 249.939 436.904 240.042 384.883C229.437 329.144 219.567 281.771 203.885 248.393C196.313 232.276 188.958 223.041 182.705 218.062C177.534 213.945 171.682 211.466 162.163 211.718C142.693 212.233 133.337 218.727 126.324 227.991C117.269 239.953 109.565 260.585 104.962 292.676C95.5092 358.568 102.238 440.161 102.596 525.505C102.713 553.119 80.4213 575.599 52.8074 575.715C25.1934 575.831 2.7135 553.539 2.59747 525.925C2.28937 452.602 -4.85969 354.006 5.97539 278.476C11.5158 239.854 22.4969 199.466 46.5916 167.636C72.7285 133.108 110.987 113.038 159.516 111.753C192.496 110.88 221.356 121.011 244.991 139.828C267.543 157.783 283.089 181.808 294.393 205.869C316.465 252.846 328.255 313.499 338.28 366.192C349.012 422.603 357.915 470.999 372.348 506.187C386.856 541.553 398.432 544.122 405.759 544.218C417.162 544.366 424.049 541.996 428.606 539.396C433.343 536.695 438.371 532.125 443.545 523.981C454.908 506.094 462.976 477.658 469.564 438.234C472.748 419.186 475.342 399.34 478.124 378.451C480.854 357.95 483.765 336.457 487.471 315.842C494.528 276.599 505.823 231.26 532.048 197.937C568.844 151.181 605.968 126.324 649.172 116.17Z" fill="url(#nuraiGrad)" />
                    <path d="M386.954 7.11034C396.222 -2.24621 411.299 -2.38641 420.739 6.79589L467.656 52.4297C477.282 61.7925 477.353 77.2314 467.814 86.6826L420.9 133.163C411.422 142.554 396.103 142.411 386.802 132.846L341.601 86.3623C332.483 76.9853 332.552 62.0337 341.757 52.7412L386.954 7.11034Z" fill="url(#nuraiGrad)" />
                    <defs>
                      <linearGradient id="nuraiGrad" x1="0" y1="322" x2="784" y2="322" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#085A70" />
                        <stop offset="0.5" stopColor="#6AACBF" />
                        <stop offset="1" stopColor="#B9EFFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
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
