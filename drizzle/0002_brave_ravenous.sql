ALTER TABLE "sync_logs" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "sync_logs" ALTER COLUMN "id" DROP IDENTITY;