import { Elysia } from "elysia";
import { DuplicateEmailError, registerUser } from "../services/users-service";

type RegisterBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

function isValidRegisterBody(body: RegisterBody): body is { name: string; email: string; password: string } {
  return (
    typeof body.name === "string" &&
    body.name.trim().length > 0 &&
    typeof body.email === "string" &&
    body.email.trim().length > 0 &&
    typeof body.password === "string" &&
    body.password.length > 0
  );
}

export const usersRoute = new Elysia().post("/api/users", async ({ body, set }) => {
  const payload = body as RegisterBody;

  if (!isValidRegisterBody(payload)) {
    set.status = 400;
    return { error: "invalid request body" };
  }

  try {
    return await registerUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      set.status = 400;
      return { error: "email sudah terdaftar" };
    }

    throw error;
  }
});
