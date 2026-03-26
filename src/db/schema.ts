import {
  int,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
  foreignKey,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    usersEmailUnique: uniqueIndex("users_email_unique").on(table.email),
  }),
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    userId: int("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    sessionsUserIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "sessions_user_id_fk",
    }).onDelete("cascade"),
  }),
);
