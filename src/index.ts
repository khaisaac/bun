import { app } from "./app/server";
import { env } from "./config/env";

app.listen(env.app.port);

console.log(`Server running at http://localhost:${env.app.port}`);
