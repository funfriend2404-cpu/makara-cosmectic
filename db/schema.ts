import { pgTable, text, integer, doublePrecision, bigint, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text().primaryKey(),
  name: text().notNull(),
  sku: text().notNull(),
  qty: integer().notNull().default(0),
  cost: doublePrecision().notNull().default(0),
  price: doublePrecision().notNull().default(0),
  photo: text(),
});

export const sales = pgTable("sales", {
  id: text().primaryKey(),
  timestamp: bigint({ mode: "number" }).notNull(),
  items: jsonb().notNull(),
  subtotal: doublePrecision().notNull().default(0),
  discountAmount: doublePrecision("discount_amount").notNull().default(0),
  total: doublePrecision().notNull().default(0),
});
