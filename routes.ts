import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Diagnostics Routes ---
  app.get(api.diagnostics.list.path, async (req, res) => {
    const results = await storage.getDiagnosticResults();
    res.json(results);
  });

  app.post(api.diagnostics.create.path, async (req, res) => {
    try {
      const input = api.diagnostics.create.input.parse(req.body);
      const result = await storage.createDiagnosticResult(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // --- Battery Logs Routes ---
  app.get(api.batteryLogs.list.path, async (req, res) => {
    const logs = await storage.getBatteryLogs();
    res.json(logs);
  });

  app.post(api.batteryLogs.create.path, async (req, res) => {
    try {
      const input = api.batteryLogs.create.input.parse(req.body);
      const log = await storage.createBatteryLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // --- Seed Data ---
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingDiagnostics = await storage.getDiagnosticResults();
  if (existingDiagnostics.length === 0) {
    // Seed some initial diagnostic history
    await storage.createDiagnosticResult({
      toolName: "System Initialization",
      status: "pass",
      details: "Initial system check completed successfully"
    });
  }

  const existingBatteryLogs = await storage.getBatteryLogs();
  if (existingBatteryLogs.length === 0) {
    // Seed some battery data for the graph
    await storage.createBatteryLog({ level: "85", isCharging: false });
    await storage.createBatteryLog({ level: "84", isCharging: false });
    await storage.createBatteryLog({ level: "82", isCharging: false });
    await storage.createBatteryLog({ level: "80", isCharging: false });
  }
}
