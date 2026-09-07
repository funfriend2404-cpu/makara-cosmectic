// Shared cloud storage for the POS app, backed by Netlify Blobs.
// One JSON blob holds { products, sales } for the whole store, so every
// device that opens the site reads and writes the same data.
//
// Important: getStore() is created *inside* the handler (not at module
// load time). Creating it outside the handler is the most common cause
// of "MissingBlobsEnvironmentError" in production.

const { getStore } = require("@netlify/blobs");

const STORE_NAME = "makara-pos";
const KEY = "app-state";

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
    const store = getStore(STORE_NAME);

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
      const products = Array.isArray(body.products) ? body.products : [];
      const sales = Array.isArray(body.sales) ? body.sales : [];
      await store.setJSON(KEY, { products, sales });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Unknown error" }),
    };
  }
};
