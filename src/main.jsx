import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);git add .
git commit -m "Add card CCV and expiry date fields to form and receipt"
git push