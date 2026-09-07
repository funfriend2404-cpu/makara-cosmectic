CREATE TABLE "products" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"sku" text NOT NULL,
	"qty" integer DEFAULT 0 NOT NULL,
	"cost" double precision DEFAULT 0 NOT NULL,
	"price" double precision DEFAULT 0 NOT NULL,
	"photo" text
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" text PRIMARY KEY,
	"timestamp" bigint NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" double precision DEFAULT 0 NOT NULL,
	"discount_amount" double precision DEFAULT 0 NOT NULL,
	"total" double precision DEFAULT 0 NOT NULL
);
