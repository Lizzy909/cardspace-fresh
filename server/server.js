
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");

const allowedOrigin =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10kb" }));

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

const allowedCards = new Set([
  "Amazon",
  "Apple",
  "Google Play",
  "Steam",
  "PlayStation",
  "Xbox",
  "Sephora",
  "Walmart",
  "Other",
]);

const allowedCountries = new Set([
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Other",
]);

const allowedCurrencies = new Set([
  "USD",
  "NGN",
  "GBP",
  "CAD",
  "AUD",
  "EUR",
]);

const resend = new Resend(process.env.RESEND_API_KEY);

function cleanText(value, maxLength = 100) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Cardspace API",
  });
});

// GIFT CARD SUBMISSION
app.post("/api/verification", submissionLimiter, async (req, res) => {
  try {
    const cardType = cleanText(req.body?.cardType, 50);
    const country = cleanText(req.body?.country, 60);
    const currency = cleanText(req.body?.currency, 3);
    const amount = Number(req.body?.amount);

    if (
      !allowedCards.has(cardType) ||
      !allowedCountries.has(country) ||
      !allowedCurrencies.has(currency)
    ) {
      return res.status(400).json({
        message: "Please select valid card, country, and currency options.",
      });
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000
    ) {
      return res.status(400).json({
        message: "Please enter a valid card amount.",
      });
    }

    const {
      RESEND_API_KEY,
      EMAIL_FROM,
      OWNER_EMAIL,
    } = process.env;

    if (!RESEND_API_KEY || !EMAIL_FROM || !OWNER_EMAIL) {
      console.error("Email configuration is incomplete.");

      return res.status(503).json({
        message: "We cannot process your request right now.",
      });
    }

    const submittedAt = new Date().toLocaleString("en-NG", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Africa/Lagos",
    });

    const reference = randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase();

    const safeCard = escapeHtml(cardType);
    const safeCountry = escapeHtml(country);
    const safeAmount = escapeHtml(
      `${currency} ${amount.toFixed(2)}`
    );
    const safeDate = escapeHtml(submittedAt);
    const safeReference = escapeHtml(reference);

    // HTML EMAIL: TEXT ONLY
    const emailHtml = `
      <div style="
        background:#f4f5f9;
        padding:30px 15px;
        font-family:Arial,sans-serif;
        color:#202333;
      ">
        <div style="
          max-width:550px;
          margin:auto;
          background:#ffffff;
          border:1px solid #e5e7ef;
          border-radius:12px;
          padding:28px;
        ">
          <h1 style="
            text-align:center;
            letter-spacing:3px;
            color:#202333;
          ">
            CARDSPACE
          </h1>

          <h2 style="
            color:#6549F5;
            text-align:center;
          ">
            NEW GIFT CARD REQUEST
          </h2>

          <p>
            A new gift card submission has been received.
          </p>

          <hr style="border:0;border-top:1px solid #e5e7ef;">

          <p><strong>Brand:</strong> ${safeCard}</p>
          <p><strong>Country:</strong> ${safeCountry}</p>
          <p><strong>Amount:</strong> ${safeAmount}</p>

          <p>
            <strong>Status:</strong>
            <span style="color:#b7791f;">
              Pending review
            </span>
          </p>

          <p><strong>Reference:</strong> ${safeReference}</p>
          <p><strong>Date:</strong> ${safeDate}</p>

          <hr style="border:0;border-top:1px solid #e5e7ef;">

          <p style="
            font-size:12px;
            color:#777;
            text-align:center;
          ">
            This is a submission notification.
            It does not establish card validity or activation.
          </p>
        </div>
      </div>
    `;

    // PLAIN TEXT EMAIL
    const emailText = [
      "CARDSPACE - NEW GIFT CARD REQUEST",
      "",
      "A new gift card submission has been received.",
      "",
      `Brand: ${cardType}`,
      `Country: ${country}`,
      `Amount: ${currency} ${amount.toFixed(2)}`,
      "Status: Pending review",
      `Reference: ${reference}`,
      `Date Submitted: ${submittedAt}`,
      "",
      "This is a submission notification, not proof of card validity.",
    ].join("\n");

    // SEND TEXT EMAIL TO WEBSITE OWNER
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [OWNER_EMAIL],
      subject: `New ${cardType} Gift Card Request - ${reference}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error("Resend error:", error.message);

      return res.status(502).json({
        message: "We couldn't send your request. Please try again later.",
      });
    }

    console.log("Owner notification sent:", data?.id);
    console.log("Submission reference:", reference);

    return res.status(200).json({
      message: "Your request has been submitted successfully.",
      reference,
      submittedAt,
      status: "Pending review",
    });

  } catch (error) {
    console.error("Cardspace request error:", error.message);

    return res.status(500).json({
      message: "We couldn't process your request. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Cardspace API running on port ${PORT}`);
});
