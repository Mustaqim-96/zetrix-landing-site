export default function SiteFooter() {
  return (
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
  );
}
