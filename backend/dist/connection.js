"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _pg = require("pg");
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ENV = process.env.NODE_ENV || "test";
console.log(ENV, "in connection");
_dotenv.default.config({
  path: `${__dirname}/../.env.${ENV}`
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
const db = new _pg.Pool(config);
var _default = exports.default = db;