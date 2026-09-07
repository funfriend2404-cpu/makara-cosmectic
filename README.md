# Makara Cosmectic POS — cloud-synced, free on Netlify

This is a complete, self-contained package:

- `index.html` — the whole POS app (React, loaded from a CDN, no build tools needed to edit it)
- `netlify/functions/data.js` — one small serverless function that stores your
  products and sales in **Netlify Blobs** (free, included with every Netlify site)
- `package.json` / `netlify.toml` — tells Netlify what to install and where the function lives

Because data now lives in the cloud instead of the browser's local storage,
anything you add on one device (phone, laptop, another computer) shows up on
every other device that opens the same site.

## How to deploy (drag-and-drop)

1. Go to <https://app.netlify.com/drop> while logged in to your Netlify account.
2. Drag the **whole folder** (not just `index.html`) into the drop zone —
   make sure `netlify.toml`, `package.json`, and the `netlify/functions/`
   folder all go along with it.
3. Netlify will detect `package.json`, install the one dependency
   (`@netlify/blobs`), and publish the site. This takes a minute or two —
   longer than a plain static file, because it's installing that dependency.
4. Open your new `*.netlify.app` link. Add a product in **Inventory**, then
   check it also appears if you open the same link on your phone.

A small dot next to the gear icon (top-right) shows sync status: green =
synced to the cloud, amber = syncing, orange = offline (saved on this device
only, will retry).

## If drag-and-drop doesn't pick up the function

Occasionally a manual drop doesn't run the install step. If the dot stays
orange/offline, or the function logs show `MissingBlobsEnvironmentError`:

1. Go to **Deploys** → the "..." menu on the latest deploy → **"Deploy project
   without cache"**. This alone fixes it most of the time.
2. If it still fails, the most reliable path is connecting a **GitHub repo**
   instead of drag-and-drop: push this folder to a new repo, then in Netlify
   choose **Add new site → Import an existing project → GitHub**, and pick
   the repo. Git-connected deploys always run `npm install` properly.

## Notes

- No database setup, no environment variables, no manual "connection string"
  copying — Netlify Blobs auto-configures itself once the site has a
  completed production deploy.
- Product photos are compressed to small JPEGs and stored directly inside
  the product record (no separate image storage needed), which avoids the
  extra failure points larger apps run into with image uploads.
- The **Export backup / Restore backup** buttons in Settings still work as a
  manual, offline copy — handy before making big changes.
- This uses your Netlify account's free tier. Netlify Blobs storage and
  function invocations are both very cheap at small-shop scale, so this
  should comfortably fit inside the free plan.
