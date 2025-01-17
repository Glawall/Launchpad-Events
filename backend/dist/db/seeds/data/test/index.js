"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testData = exports.default = void 0;
var _users = _interopRequireDefault(require("./users.js"));
var _events = _interopRequireDefault(require("./events.js"));
var _attendees = _interopRequireDefault(require("./attendees.js"));
var _event_types = _interopRequireDefault(require("./event_types.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const testData = exports.testData = {
  users: _users.default,
  events: _events.default,
  attendees: _attendees.default,
  eventTypes: _event_types.default
};
var _default = exports.default = {
  users: _users.default,
  events: _events.default,
  attendees: _attendees.default,
  eventTypes: _event_types.default
};