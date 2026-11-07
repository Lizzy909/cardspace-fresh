
import { Layers, ArrowUpRight, Mail, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand-column">
          <a href="#home" className="footer-brand">
            <span className="footer-brand-icon">
              <Layers size={25} />
            </span>
            <span>
              Card<span className="footer-brand-accent">space</span>
            </span>
          </a>

          <p className="footer-description">
            Your gift card request, made simple. Submit your details and
            let our team take care of the next steps.
          </p>

          <a
            className="footer-email"
            href="mailto:cardcode95@gmail.com"
          >
            <Mail size={17} />
            cardcode95@gmail.com
          </a>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#verify">Verify Gift Card</a>
        </div>

        <div className="footer-column footer-contact-column">
          <h3>Get in Touch</h3>
          <p>Have a question about your request?</p>

          <a
            className="footer-contact-link"
            href="mailto:cardcode95@gmail.com"
          >
            Contact our team <ArrowUpRight size={16} />
          </a>

          <div className="footer-security">
            <ShieldCheck size={17} />
            <span>Your information matters</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Cardspace. All rights reserved.</p>

        <a href="#home" className="footer-back-to-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
