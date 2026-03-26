import { Elysia } from "elysia";
import { db, pool } from "../db/client";

export const app = new Elysia()
  .get("/health", async () => {
    await db.execute("SELECT 1");

    return {
      status: "ok",
      db: "connected",
      timestamp: new Date().toISOString(),
    };
  })
  .onStop(async () => {
    await pool.end();
  });
