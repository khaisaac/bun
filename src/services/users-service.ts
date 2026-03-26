import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users } from "../db/schema";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export class DuplicateEmailError extends Error {
  constructor() {
    super("email sudah terdaftar");
    this.name = "DuplicateEmailError";
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerUser(input: RegisterUserInput): Promise<{ data: "ok" }> {
  const email = normalizeEmail(input.email);

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new DuplicateEmailError();
  }

  const passwordHash = await hash(input.password, 10);

  await db.insert(users).values({
    name: input.name.trim(),
    email,
    password: passwordHash,
  });

  return { data: "ok" };
}
