import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Store results of diagnostic tests
export const diagnosticResults = pgTable("diagnostic_results", {
  id: serial("id").primaryKey(),
  toolName: text("tool_name").notNull(), // e.g., "Speaker Test", "Vibration"
  status: text("status").notNull(), // "pass", "fail", "pending"
  details: text("details"), // Optional details
  createdAt: timestamp("created_at").defaultNow(),
});

// Log battery stats for the graph
export const batteryLogs = pgTable("battery_logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(), // Stored as text to keep it simple, or integer percentage
  isCharging: boolean("is_charging").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === SCHEMAS ===

export const insertDiagnosticSchema = createInsertSchema(diagnosticResults).omit({ 
  id: true, 
  createdAt: true 
});

export const insertBatteryLogSchema = createInsertSchema(batteryLogs).omit({ 
  id: true, 
  timestamp: true 
});

// === TYPES ===

export type DiagnosticResult = typeof diagnosticResults.$inferSelect;
export type InsertDiagnostic = z.infer<typeof insertDiagnosticSchema>;

export type BatteryLog = typeof batteryLogs.$inferSelect;
export type InsertBatteryLog = z.infer<typeof insertBatteryLogSchema>;

// Request types
export type CreateDiagnosticRequest = InsertDiagnostic;
export type CreateBatteryLogRequest = InsertBatteryLog;

// Response types
export type DiagnosticResponse = DiagnosticResult;
export type BatteryLogResponse = BatteryLog;
