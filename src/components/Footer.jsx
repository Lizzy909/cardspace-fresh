
import { Layers, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand-column">
          <a href="#home" className="footer-brand">
            <span className="footer-brand-icon">
              <Layers size={22} />
            </span>
            <span>
              Giftcard<span className="footer-brand-accent">Official</span>
            </span>
          </a>

          <p className="footer-description">
            Your gift card request, made simple. Submit your details and
            let our team take care of the next steps.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#verify">Verify Gift Card</a>

          <div className="footer-security">
            <ShieldCheck size={16} />
            <span>Your information matters</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} GiftcardOfficial. All rights reserved.
        </p>

        <a href="#home" className="footer-back-to-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
