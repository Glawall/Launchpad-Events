import { Pool } from "pg";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "production";
console.log(ENV, "in connection");

dotenv.config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(ENV, "in connection");

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (process.env.DATABASE_URL) {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
} else {
  config.database = process.env.PGDATABASE || "community_events_test";
}

const db = new Pool(config);

export default db;
