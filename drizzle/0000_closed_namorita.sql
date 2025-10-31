CREATE TYPE "public"."sync_status" AS ENUM('success', 'failed', 'partial');--> statement-breakpoint
CREATE TYPE "public"."trigger_source" AS ENUM('manual', 'cron', 'api');--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"name" varchar(100),
	"tagline" varchar(255),
	"thumbnail" varchar(255),
	"url" varchar(255),
	"website" varchar(255),
	"created_at" timestamp NOT NULL,
	"makers" integer NOT NULL,
	"twitter" varchar(255),
	"facebook" varchar(255),
	"linkedin" varchar(255),
	"instagram" varchar(255),
	"github" varchar(255),
	"enable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "post_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "sync_logs" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sync_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"sync_time" timestamp NOT NULL,
	"status" "sync_status" NOT NULL,
	"duration_ms" integer,
	"total_fetched" integer DEFAULT 0 NOT NULL,
	"new_products" integer DEFAULT 0 NOT NULL,
	"updated_products" integer DEFAULT 0 NOT NULL,
	"discard_products" integer DEFAULT 0 NOT NULL,
	"failed_products" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"trigger_source" "trigger_source" DEFAULT 'api' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
