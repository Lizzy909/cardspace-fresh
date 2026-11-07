
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import GiftCardForm from "./components/GiftCardForm";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <section className="verification-section" id="verify">
          <div className="section-heading">
            <span className="section-eyebrow">
              GET STARTED
            </span>

            <h2>Verify Your Gift Card</h2>

            <p>
              Fill in the details below to submit your request.
              Our team will receive your information by email.
            </p>
          </div>

          <GiftCardForm />
        </section>

        <HowItWorks />
      </main>

      <Footer />
    </>
  );
}
