# Greenest Chatbot Widget

Retseptiassistendi widget Greenest e-poe jaoks, mille backend töötab Google Apps Scriptis ja frontend laetakse Render serverist.

## Repo struktuur

```
Greenest-chatbot/
├── greenest-widget/          # Widget JS + CSS + demo
│   ├── greenest-widget.js
│   ├── greenest-widget.css
│   ├── demo.html
│   └── catalog.products.json
├── greenest-ai-bot/          # Google Apps Script backend
│   ├── code.gs
│   └── templates/
├── server/                   # Express server Render jaoks
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── docs/
│   └── Greenest_Developer_Integration_Guide.html
└── render.yaml               # Render deploy konfiguratsioon
```

## Kiire start (Render deploy)

1. Fork this repo
2. Loo Render Web Service, ühenda see repo
3. Render kasutab automaatselt `render.yaml` konfiguratsiooni
4. Teenus käivitub aadressil `https://greenest-chatbot.onrender.com`

## Widget embed (Greenesti arendajatele)

Lisage oma lehe `<head>` sektsiooni:

```html
<script src="https://greenest-chatbot.onrender.com/widget/loader.js" defer></script>
```

Täpsem juhend: [docs/Greenest_Developer_Integration_Guide.html](docs/Greenest_Developer_Integration_Guide.html)

## Keskkonna muutujad

| Muutuja | Kirjeldus |
|---------|-----------|
| `APPS_SCRIPT_URL` | Google Apps Script web app URL |
| `SITE_TOKEN` | Turvalisuse token (peab kattuma Apps Script seadistusega) |
| `RENDER_EXTERNAL_URL` | Seab Render automaatselt |

## Lokaalne arendus

```bash
cd server
npm install
node index.js
# Avage http://localhost:3000/health
```
