// Shared cloud storage for the POS app, backed by Netlify Database.
// Every device that opens the site reads and writes the same products
// and sales rows, so the store stays in sync across devices.
import { db } from "../../db/index.js";
import { products, sales } from "../../db/schema.js";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function readAll() {
  const [allProducts, allSales] = await Promise.all([
    db.select().from(products),
    db.select().from(sales),
  ]);
  return { products: allProducts, sales: allSales };
}

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method === "GET") {
      return Response.json(await readAll(), { headers: corsHeaders });
    }

    if (req.method === "POST") {
      const body = await req.json();

      await db.transaction(async (tx) => {
        if (Array.isArray(body.products)) {
          await tx.delete(products);
          if (body.products.length > 0) {
            await tx.insert(products).values(body.products);
          }
        }
        if (Array.isArray(body.sales)) {
          await tx.delete(sales);
          if (body.sales.length > 0) {
            await tx.insert(sales).values(body.sales);
          }
        }
      });

      return Response.json(await readAll(), { headers: corsHeaders });
    }

    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    );
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: corsHeaders },
    );
  }
};
