import { defineApp } from "convex/server";
import auth from "@convex-dev/auth/server";

const app = defineApp();

auth(app, {
  // Optional: Add auth providers here
});

export default app;
