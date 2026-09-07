// Shared cloud storage for the POS app, backed by Netlify Blobs.
// One JSON blob holds { products, sales } for the whole store, so every
// device that opens the site reads and writes the same data.
//
// This is written as a V2 function (default export + Request/Response),
// which receives the Netlify Blobs context automatically on every deploy.
// The older V1 style (`exports.handler`) does not get that context
// injected reliably, which is what caused "The environment has not been
// configured to use Netlify Blobs" in production.

import { getStore } from "@netlify/blobs";

const STORE_NAME = "makara-pos";
const KEY = "app-state";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const store = getStore(STORE_NAME);

    if (req.method === "GET") {
      const data = await store.get(KEY, { type: "json" });
      return Response.json(data || { products: [], sales: [] }, {
        headers: corsHeaders,
      });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
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
      return Response.json(updated, { headers: corsHeaders });
    }

    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    );
  } catch (err) {
    // Always return the real error message in the response body so it's
    // visible directly in the browser / network tab, not just in logs
    // that require digging through the dashboard.
    return Response.json(
      { error: err && err.message ? err.message : String(err) },
      { status: 500, headers: corsHeaders },
    );
  }
};
