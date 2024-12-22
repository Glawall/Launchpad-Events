"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _pgFormat = _interopRequireDefault(require("pg-format"));
var _fs = require("fs");
var _path = _interopRequireDefault(require("path"));
var _connection = _interopRequireDefault(require("../../connection"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const schemaFiles = ["users.sql", "event_types.sql", "events.sql", "event_attendees.sql"];
const createTables = async () => {
  try {
    await _connection.default.query(`
      DROP TABLE IF EXISTS event_attendees CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS event_types CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    for (const file of schemaFiles) {
      const filePath = _path.default.join(`${__dirname}/../../db/schema`, file);
      const sql = (0, _fs.readFileSync)(filePath, "utf-8");
      await _connection.default.query(sql);
    }
  } catch (error) {
    console.log(error);
  }
};
const seed = async ({
  eventTypes,
  events,
  users,
  attendees
}) => {
  try {
    await createTables();
    const insertUsersStr = (0, _pgFormat.default)("INSERT INTO users (email, name, password_hash, role) VALUES %L;", await Promise.all(users.map(async ({
      email,
      name,
      password,
      role
    }) => [email, name, await _bcryptjs.default.hash(password, 10), role])));
    await _connection.default.query(insertUsersStr);
    const insertEventTypesStr = (0, _pgFormat.default)("INSERT INTO event_types (name, description) VALUES %L", eventTypes.map(({
      name,
      description
    }) => [name, description]));
    await _connection.default.query(insertEventTypesStr);
    const insertEventsStr = (0, _pgFormat.default)(`INSERT INTO events (
        title, 
        description, 
        date, 
        end_date,
        capacity, 
        location_name, 
        location_address, 
        event_type_id, 
        creator_id, 
        status,
        timezone
      ) VALUES %L`, events.map(({
      title,
      description,
      date,
      end_date,
      capacity,
      location_name,
      location_address,
      event_type_id,
      creator_id,
      status,
      timezone
    }) => [title, description, date, end_date || new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000), capacity, location_name, location_address, event_type_id, creator_id, status || "upcoming", timezone || "Europe/London"]));
    await _connection.default.query(insertEventsStr);
    const insertAttendeesStr = (0, _pgFormat.default)("INSERT INTO event_attendees (event_id, user_id, added_to_calendar) VALUES %L", attendees.map(({
      event_id,
      user_id,
      added_to_calendar
    }) => [event_id, user_id, added_to_calendar]));
    await _connection.default.query(insertAttendeesStr);
  } catch (error) {
    console.log(error);
  }
};
var _default = exports.default = seed;