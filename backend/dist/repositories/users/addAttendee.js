"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAttendee = void 0;
var _connection = _interopRequireDefault(require("../../connection"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const addAttendee = async (eventId, userId) => {
  try {
    const result = await _connection.default.query(`INSERT INTO event_attendees (event_id, user_id)
       VALUES ($1, $2)
       RETURNING *`, [eventId, userId]);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23503") {
      throw new Error("Event not found");
    }
    throw error;
  }
};
exports.addAttendee = addAttendee;