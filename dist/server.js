"use strict";

var _app = _interopRequireDefault(require("./app"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  PORT = 8006
} = process.env;
const startServer = async () => {
  try {
    _app.default.listen(PORT, () => console.log(`Listening on ${PORT}...`));
  } catch (error) {
    process.exit(1);
  }
};
startServer();