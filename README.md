# Makara Cosmetic POS — cloud-synced, free on Netlify

A complete, self-contained package:

- `index.html` — the whole POS app (loaded from a CDN, no build tools needed to edit it)
- `netlify/functions/data.mjs` — one serverless function that stores your products and sales in Netlify Blobs, shared across every device
- `netlify.toml` / `package.json` — deploy configuration

## Deploying

1. Push this whole folder to a GitHub repository (all files, not a zip).
2. In Netlify: **Add new project → Import an existing project → GitHub** → select the repo.
3. Leave build settings as detected. Click **Deploy**.

Netlify Blobs needs no setup or environment variables — it works automatically once the site is deployed.

## Verifying it works

1. Open the live `*.netlify.app` link, add a test product.
2. Check the small dot near the gear icon — green means synced.
3. Open the same link on a second device — the test product should appear there too.
4. In the Netlify dashboard, go to **Logs & metrics → Observability** and confirm the error rate is 0%.

## Backups

Use **Settings → Export backup** in the app periodically to save an offline copy of your data, independent of cloud sync.
