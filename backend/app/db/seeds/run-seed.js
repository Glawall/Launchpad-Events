import db from "../../connection.js";
import { testData } from "./data/test/index.js";
import { devData } from "./data/development/index.js";
import seed from "./seed";

const ENV = process.env.NODE_ENV || "production";

console.log("Database URL:", process.env.DATABASE_URL);

const runSeed = async (data) => {
  try {
    await seed(data);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await db.end();
  }
};

const dataToSeed = ENV === "test" ? testData : devData;

if (dataToSeed) {
  runSeed(dataToSeed);
} else {
  console.warn("No seed data available for the current environment.");
}
module.exports = runSeed;
