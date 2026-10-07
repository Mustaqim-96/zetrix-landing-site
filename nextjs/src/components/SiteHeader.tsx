import Link from "next/link";
import HomeLogoLink from "@/components/HomeLogoLink";

type SiteHeaderProps = {
  homeLinkMode?: "next" | "document-skip-intro";
};

const logo = (
  <>
    <img className="nav__logo-mark nav__logo-mark--dark" src="/assets/img/logo-zetrix.svg" alt="Zetrix" />
    <img className="nav__logo-mark nav__logo-mark--light" src="/assets/img/logo-zetrix-light.svg" alt="" aria-hidden="true" />
  </>
);

export default function SiteHeader({ homeLinkMode = "next" }: SiteHeaderProps) {
  const homeLink = homeLinkMode === "document-skip-intro"
    ? <HomeLogoLink>{logo}</HomeLogoLink>
    : <Link className="nav__logo" href="/" aria-label="Zetrix home">{logo}</Link>;

  return (
    <header className="nav-wrap">
      <button className="nav__backdrop" type="button" data-nav-backdrop hidden aria-label="Close navigation menu"></button>
    
      <nav className="nav" data-nav aria-label="Primary">
        {homeLink}
    
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
    
        {/* Set as a raw HTML string on <noscript> itself. With JS enabled the
            browser exposes noscript content as inert text, so a real <style>
            child element makes React's hydration tree disagree with the parsed
            DOM. dangerouslySetInnerHTML keeps React from reconciling the inside
            while the styles still apply when scripting is disabled. */}
        <noscript dangerouslySetInnerHTML={{ __html: `<style>
            .nav-dropdown { opacity: 1 !important; visibility: visible !important; transform: none !important; pointer-events: auto !important; }
            .nav-dropdown__surface { height: auto !important; max-height: calc(100svh - 112px); overflow-y: auto; }
            .nav-panel__group { display: block !important; margin-bottom: 12px; }
            .nav-panel__accordion { display: flex !important; }
          </style>` }} />
      </nav>
    </header>
  );
}
