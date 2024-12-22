"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventById = void 0;
var _connection = _interopRequireDefault(require("../../connection.js"));
var _errorHandler = require("../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getEventById = async id => {
  try {
    const {
      rows: [event]
    } = await _connection.default.query(`
      SELECT 
        events.*,
        event_types.name as event_type_name,
        event_types.description as event_type_description,
        users.name as creator_name
      FROM events
      LEFT JOIN event_types ON events.event_type_id = event_types.id
      LEFT JOIN users ON events.creator_id = users.id
      WHERE events.id = $1
    `, [id]);
    if (!event) return null;
    const {
      rows: attendees
    } = await _connection.default.query(`
      SELECT 
        users.id,
        users.name,
        users.email,
        event_attendees.added_to_calendar,
        event_attendees.created_at as joined_at
      FROM event_attendees
      JOIN users ON event_attendees.user_id = users.id
      WHERE event_attendees.event_id = $1
      ORDER BY event_attendees.created_at ASC
    `, [id]);
    return {
      ...event,
      attendees: attendees || []
    };
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.getEventById = getEventById;