import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

// Placeholder table so Drizzle has an initial schema target.
export const example = mysqlTable("example", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});
