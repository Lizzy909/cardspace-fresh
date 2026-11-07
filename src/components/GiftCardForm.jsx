
import { useState } from "react";
import {
  Gift,
  ArrowRight,
  LockKeyhole,
  LoaderCircle,
  Check,
  X,
} from "lucide-react";

const initialForm = {
  cardType: "",
  country: "",
  currency: "",
  amount: "",
};

export default function GiftCardForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to send your request."
        );
      }

      setSubmittedDetails({ ...form });
      setForm(initialForm);
      setShowSuccess(true);

    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "We couldn't send your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function closeSuccess() {
    setShowSuccess(false);
    setSubmittedDetails(null);
  }

  return (
    <>
      <section className="verification-card" id="verify">

        <div className="form-heading">
          <div className="form-heading-icon">
            <Gift size={25} />
          </div>

          <div>
            <h2>Verify Your Gift Card</h2>
            <p>
              Fill in the details below to submit your request.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="field">
            <label htmlFor="cardType">Gift Card Type</label>

            <select
              id="cardType"
              name="cardType"
              value={form.cardType}
              onChange={handleChange}
              required
            >
              <option value="">Select card type</option>
              <option value="Amazon">Amazon</option>
              <option value="Apple">Apple</option>
              <option value="Google Play">Google Play</option>
              <option value="Steam">Steam</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Sephora">Sephora</option>
              <option value="Walmart">Walmart</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">

            <div className="field">
              <label htmlFor="country">Country / Region</label>

              <select
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              >
                <option value="">Select country</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="currency">Currency</label>

              <select
                id="currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                required
              >
                <option value="">Select currency</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

          </div>

          <div className="field">
            <label htmlFor="amount">Card Amount</label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              max="1000000"
              step="0.01"
              placeholder="e.g. 25, 50, 100"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <p className="form-safety">
            Do not enter a card PIN, password, or redeemable claim code.
          </p>

          <button
            className="submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="spin" size={19} />
                Sending Request...
              </>
            ) : (
              <>
                Submit Verification Request
                <ArrowRight size={19} />
              </>
            )}
          </button>

          {status.message && (
            <div
              className={`form-status ${status.type}`}
              role="alert"
            >
              {status.message}
            </div>
          )}

          <p className="privacy-note">
            <LockKeyhole size={14} />
            Your request is sent securely to our team.
          </p>

        </form>
      </section>

      {showSuccess && submittedDetails && (
        <div
          className="cardspace-success-overlay"
          onClick={closeSuccess}
        >
          <div
            className="cardspace-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              className="cardspace-close-icon"
              onClick={closeSuccess}
              aria-label="Close success message"
            >
              <X size={20} />
            </button>

            <div className="cardspace-success-icon">
              <Check size={38} strokeWidth={3.5} />
            </div>

            <h2 id="success-title">SUCCESS!</h2>

            <p className="success-description">
              Your {submittedDetails.cardType.toLowerCase()} gift
              card verification request has been received.
            </p>

            <div className="success-divider" />

            <div className="result-heading">
              HERE'S YOUR SUBMISSION
            </div>

            <div className="submission-details">

              <div className="submission-row">
                <span>Brand</span>
                <strong>{submittedDetails.cardType}</strong>
              </div>

              <div className="submission-row">
                <span>Country</span>
                <strong>{submittedDetails.country}</strong>
              </div>

              <div className="submission-row">
                <span>Amount</span>
                <strong>
                  {submittedDetails.currency}{" "}
                  {Number(submittedDetails.amount).toFixed(2)}
                </strong>
              </div>

              <div className="submission-row">
                <span>Status</span>
                <strong className="pending-status">
                  Submitted Successfully!
                </strong>
              </div>

            </div>

            <div className="success-footer">
              <LockKeyhole size={14} />
              Your submission has been received.
            </div>

            <button
              type="button"
              className="cardspace-success-button"
              onClick={closeSuccess}
            >
              Close
              <ArrowRight size={17} />
            </button>

          </div>
        </div>
      )}
    </>
  );
}
