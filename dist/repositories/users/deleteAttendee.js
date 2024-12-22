"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAttendee = void 0;
var _connection = _interopRequireDefault(require("../../connection"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const deleteAttendee = async (eventId, userId) => {
  try {
    const result = await _connection.default.query(`DELETE FROM event_attendees 
       WHERE event_id = $1 AND user_id = $2
       RETURNING *`, [eventId, userId]);
    if (!result.rows.length) {
      throw new Error("User is not attending this event");
    }
    return result.rows[0];
  } catch (error) {
    if (error.code === "23503") {
      throw new Error("Event not found");
    }
    throw error;
  }
};
exports.deleteAttendee = deleteAttendee;