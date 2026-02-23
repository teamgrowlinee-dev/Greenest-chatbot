const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Render injects this automatically; locally falls back to localhost
const RENDER_URL =
  process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const SITE_TOKEN = process.env.SITE_TOKEN || "";

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "Greenest Widget Server", version: "1.0.0" });
});

// ─── Static widget files ─────────────────────────────────────────────────────
// Serves greenest-widget.js and greenest-widget.css from the sibling folder
const widgetDir = path.join(__dirname, "..", "greenest-widget");
app.use("/widget", express.static(widgetDir, { maxAge: "1h" }));

// ─── Dynamic loader script ───────────────────────────────────────────────────
// This is the 1-line embed that goes into Greenest's website <head>
// <script src="https://YOUR-RENDER-URL/widget/loader.js" defer></script>
app.get("/widget/loader.js", (_req, res) => {
  const script = `(function () {
  // Merge caller's config with defaults — caller's values win
  var existing = window.GREENEST_WIDGET_CONFIG || {};
  window.GREENEST_WIDGET_CONFIG = Object.assign(
    {
      apiUrl: "${APPS_SCRIPT_URL}",
      siteToken: "${SITE_TOKEN}",
      vendor: "growlinee",
      widgetVersion: "v4.5",
      recipeOnlyMode: true,
      hideRecipeImages: true,
      defaultServings: 2,
      enableChatLogging: true,
      showInternalCartUI: true,
      cartAdapterMode: "hybrid"
    },
    existing
  );

  // Inject CSS
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "${RENDER_URL}/widget/greenest-widget.css";
  document.head.appendChild(link);

  // Inject widget JS
  var script = document.createElement("script");
  script.src = "${RENDER_URL}/widget/greenest-widget.js?v=" + Date.now();
  script.defer = true;
  document.head.appendChild(script);
})();`;

  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-cache, no-store");
  res.send(script);
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Greenest Widget Server running on port ${PORT}`);
  console.log(`Widget JS:  ${RENDER_URL}/widget/greenest-widget.js`);
  console.log(`Widget CSS: ${RENDER_URL}/widget/greenest-widget.css`);
  console.log(`Loader:     ${RENDER_URL}/widget/loader.js`);
});
