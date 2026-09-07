// Shared cloud storage for the POS app, backed by Netlify Blobs.
// One JSON blob holds { products, sales } for the whole store, so every
// device that opens the site reads and writes the same data.
//
// IMPORTANT FIX: some Netlify environments don't automatically inject the
// context Netlify Blobs needs, which causes:
//   "The environment has not been configured to use Netlify Blobs"
// even though the function is running live in production.
//
// The fix is to manually configure the store using the site's own ID and
// a personal access token, which always works regardless of automatic
// context detection. Two environment variables must be set in the
// Netlify dashboard (Site configuration -> Environment variables):
//
//   BLOBS_SITE_ID   -> found at Site configuration -> General -> Site details -> Site ID
//   BLOBS_AUTH_TOKEN -> a Personal Access Token, created at
//                       User settings (click your avatar) -> Applications -> New access token
//
// If those two variables are NOT set, this code automatically falls back
// to letting Netlify configure Blobs automatically (the normal/default
// behavior), so setting them is only needed if you hit the error above.

const { getStore } = require("@netlify/blobs");

const STORE_NAME = "makara-pos";
const KEY = "app-state";

function openStore() {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_AUTH_TOKEN;

  if (siteID && token) {
    // Manual configuration - guaranteed to work regardless of environment.
    return getStore({ name: STORE_NAME, siteID, token });
  }

  // Fall back to automatic configuration (works on most standard deploys).
  return getStore(STORE_NAME);
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const store = openStore();

    if (event.httpMethod === "GET") {
      const data = await store.get(KEY, { type: "json" });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || { products: [], sales: [] }),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const current = (await store.get(KEY, { type: "json" })) || {
        products: [],
        sales: [],
      };
      const updated = {
        products: body.products !== undefined ? body.products : current.products,
        sales: body.sales !== undefined ? body.sales : current.sales,
        updatedAt: new Date().toISOString(),
      };
      await store.setJSON(KEY, updated);
      return { statusCode: 200, headers, body: JSON.stringify(updated) };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (err) {
    // Always return the real error message in the response body so it's
    // visible directly in the browser / network tab, not just in logs
    // that require digging through the dashboard.
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err && err.message ? err.message : String(err),
        hint:
          "If this mentions Blobs configuration, set BLOBS_SITE_ID and BLOBS_AUTH_TOKEN in Site configuration -> Environment variables, then redeploy.",
      }),
    };
  }
};
