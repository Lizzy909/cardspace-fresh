
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  LockKeyhole,
  Gift,
  Zap,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          SAFE · SIMPLE · RELIABLE
        </div>

        <h1 className="hero-title">
          Verify Your Gift Card
          <br />
          <span>in Minutes</span>
        </h1>

        <p className="hero-description">
          Submit your gift card details quickly and easily.
        </p>

        <div className="hero-actions">
          <a href="#verify" className="hero-primary-btn">
            Verify Your Gift Card
            <ArrowRight size={18} />
          </a>

          <a href="#how-it-works" className="hero-secondary-btn">
            See how it works
          </a>
        </div>

        <div className="hero-benefits">
          <div className="benefit-item">
            <div className="benefit-icon">
              <ShieldCheck size={21} />
            </div>
            <div>
              <strong>Secure Process</strong>
              <p>Your submitted details are handled securely.</p>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">
              <Zap size={21} />
            </div>
            <div>
              <strong>Fast Requests</strong>
              <p>Your request is sent directly to our team.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-illustration">
          <div className="illustration-orbit" />

          <div className="illustration-glow" />

          <div className="gift-card-art card-art-back">
            <span>GIFT CARD</span>
            <strong>Something special.</strong>
            <Gift size={36} />
          </div>

          <div className="gift-card-art card-art-middle">
            <div className="art-card-top">
              <span>GIFT CARDS</span>
              <Gift size={24} />
            </div>
            <strong>Your Gift Card</strong>
            <span className="art-card-caption">
              A little something for you.
            </span>
          </div>

          <div className="gift-card-art card-art-front">
            <div className="art-card-top">
              <span>GIFT CARD</span>
              <Gift size={27} />
            </div>
            <strong>Gift Card</strong>
            <span className="art-card-caption">
              Simple. Secure. Convenient.
            </span>
          </div>

          <div className="floating-status status-top">
            <CheckCircle2 size={17} />
            <span>Request Ready</span>
          </div>

          <div className="floating-status status-bottom">
            <ShieldCheck size={17} />
            <span>Security Focused</span>
          </div>
        </div>
      </div>
    </section>
  );
}
