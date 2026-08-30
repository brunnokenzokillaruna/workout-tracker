import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // CLI-only connection, used by migrate and introspect. It must be the
    // DIRECT (unpooled) URL: DDL depends on session state that a connection
    // pooler may not preserve, which makes migrations fail intermittently.
    // The application runtime uses the pooled DATABASE_URL instead.
    url: process.env["DATABASE_URL_UNPOOLED"],
  },
});
