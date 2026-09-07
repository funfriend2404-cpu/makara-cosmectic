# Makara Cosmetic POS — cloud-synced, free on Netlify

A complete, self-contained package:

- `index.html` — the whole POS app (loaded from a CDN, no build tools needed to edit it)
- `netlify/functions/data.js` — one serverless function that stores your products and sales in Netlify Blobs, shared across every device
- `netlify.toml` / `package.json` — deploy configuration

## Deploying

1. Push this whole folder to a GitHub repository (all files, not a zip).
2. In Netlify: **Add new project → Import an existing project → GitHub** → select the repo.
3. Leave build settings as detected. Click **Deploy**.

## If you see a "Netlify Blobs" error

If the sync dot stays orange, or `/.netlify/functions/data` returns a 500 error mentioning **"the environment has not been configured to use Netlify Blobs"**, do this:

1. In the Netlify dashboard, click your avatar (top right) → **User settings → Applications → New access token**. Copy the token.
2. Go to **Site configuration → General → Site details** and copy the **Site ID**.
3. Go to **Site configuration → Environment variables** and add:
   - `BLOBS_SITE_ID` = (the Site ID from step 2)
   - `BLOBS_AUTH_TOKEN` = (the token from step 1)
4. Trigger a new deploy (**Deploys → Trigger deploy → Deploy site**).

The function automatically uses these two variables if they're present, which fixes this error regardless of the underlying cause. If they're not set, it falls back to Netlify's normal automatic configuration.

## Verifying it works

1. Open the live `*.netlify.app` link, add a test product.
2. Check the small dot near the gear icon — green means synced.
3. Open the same link on a second device — the test product should appear there too.
4. In the Netlify dashboard, go to **Logs & metrics → Observability** and confirm the error rate is 0%.

## Backups

Use **Settings → Export backup** in the app periodically to save an offline copy of your data, independent of cloud sync.
