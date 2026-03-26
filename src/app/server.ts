import { Elysia } from "elysia";
import { db, pool } from "../db/client";
import { usersRoute } from "../routes/users-route";

export const app = new Elysia()
  .use(usersRoute)
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
