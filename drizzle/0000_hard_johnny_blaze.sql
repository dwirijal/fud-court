CREATE TABLE "fred_data" (
	"series_id" text NOT NULL,
	"date" date NOT NULL,
	"value" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fred_series" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"units" text,
	"frequency" text,
	"seasonal_adjustment" text,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fred_data" ADD CONSTRAINT "fred_data_series_id_fred_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."fred_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "fred_data_series_date_idx" ON "fred_data" USING btree ("series_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "fred_series_id_idx" ON "fred_series" USING btree ("id");