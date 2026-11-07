import { CreditCard, Mail, CircleCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CreditCard,
    title: "Enter Card Details",
    text: "Choose your card type and provide its country, currency, and amount.",
  },
  {
    number: "02",
    icon: Mail,
    title: "Submit Your Request",
    text: "Your submitted details are sent to our team by email.",
  },
  {
    number: "03",
    icon: CircleCheck,
    title: "Receive an Update",
    text: "Our team can follow up using the email address you provided.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="section-heading">
        <span className="section-label">HOW IT WORKS</span>
        <h2>
          Submit Your Request in <span>3 Simple Steps</span>
        </h2>
        <p>
          A straightforward process for submitting your gift card
          verification request.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map(({ number, icon: Icon, title, text }) => (
          <article className="step-card" key={number}>
            <div className="step-top">
              <span className="step-number">{number}</span>
              <div className="step-icon">
                <Icon size={23} />
              </div>
            </div>

            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}