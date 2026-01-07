import { db } from "./db";
import {
  diagnosticResults,
  batteryLogs,
  type InsertDiagnostic,
  type InsertBatteryLog,
  type DiagnosticResult,
  type BatteryLog
} from "@shared/schema";

export interface IStorage {
  // Diagnostics
  getDiagnosticResults(): Promise<DiagnosticResult[]>;
  createDiagnosticResult(result: InsertDiagnostic): Promise<DiagnosticResult>;
  
  // Battery Logs
  getBatteryLogs(): Promise<BatteryLog[]>;
  createBatteryLog(log: InsertBatteryLog): Promise<BatteryLog>;
}

export class DatabaseStorage implements IStorage {
  // Diagnostics
  async getDiagnosticResults(): Promise<DiagnosticResult[]> {
    return await db.select().from(diagnosticResults).orderBy(diagnosticResults.createdAt);
  }

  async createDiagnosticResult(result: InsertDiagnostic): Promise<DiagnosticResult> {
    const [newItem] = await db.insert(diagnosticResults).values(result).returning();
    return newItem;
  }

  // Battery Logs
  async getBatteryLogs(): Promise<BatteryLog[]> {
    return await db.select().from(batteryLogs).orderBy(batteryLogs.timestamp);
  }

  async createBatteryLog(log: InsertBatteryLog): Promise<BatteryLog> {
    const [newItem] = await db.insert(batteryLogs).values(log).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
