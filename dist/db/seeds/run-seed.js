"use strict";

var _connection = _interopRequireDefault(require("../../connection.js"));
var _index = require("./data/test/index.js");
var _index2 = require("./data/development/index.js");
var _seed = _interopRequireDefault(require("./seed"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ENV = process.env.NODE_ENV || "development";
console.log("Database URL:", process.env.DATABASE_URL);
const runSeed = async data => {
  try {
    await (0, _seed.default)(data);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await _connection.default.end();
  }
};
const dataToSeed = ENV === "test" ? _index.testData : _index2.devData;
if (dataToSeed) {
  runSeed(dataToSeed);
} else {
  console.warn("No seed data available for the current environment.");
}
module.exports = runSeed;