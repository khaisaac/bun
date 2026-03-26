import { hash, compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db/client";
import { users, sessions } from "../db/schema";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export class DuplicateEmailError extends Error {
  constructor() {
    super("email sudah terdaftar");
    this.name = "DuplicateEmailError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("email atau password salah");
    this.name = "InvalidCredentialsError";
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerUser(
  input: RegisterUserInput,
): Promise<{ data: "ok" }> {
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

export async function loginUser(
  input: LoginUserInput,
): Promise<{ data: string }> {
  const email = normalizeEmail(input.email);

  const user = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    throw new InvalidCredentialsError();
  }

  const userRecord = user[0]!;
  const passwordMatch = await compare(input.password, userRecord.password);

  if (!passwordMatch) {
    throw new InvalidCredentialsError();
  }

  const token = uuidv4();

  await db.insert(sessions).values({
    token,
    userId: userRecord.id,
  });

  return { data: token };
}
