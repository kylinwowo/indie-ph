CREATE UNIQUE INDEX "post_post_id_idx" ON "post" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_created_at_idx" ON "post" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "post_enable_idx" ON "post" USING btree ("enable");--> statement-breakpoint
CREATE INDEX "sync_logs_sync_time_idx" ON "sync_logs" USING btree ("sync_time");--> statement-breakpoint
CREATE INDEX "sync_logs_status_idx" ON "sync_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sync_logs_created_at_idx" ON "sync_logs" USING btree ("created_at");