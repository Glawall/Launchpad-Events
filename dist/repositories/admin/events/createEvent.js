"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEvent = void 0;
var _connection = _interopRequireDefault(require("../../../connection.js"));
var _errorHandler = require("../../../middleware/errorHandler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const createEvent = async eventData => {
  try {
    const {
      rows
    } = await _connection.default.query(`
      INSERT INTO events (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [eventData.title, eventData.description, eventData.date, eventData.end_date, eventData.capacity, eventData.location_name, eventData.location_address, eventData.event_type_id, eventData.creator_id, eventData.status || "upcoming", eventData.timezone || "Europe/London"]);
    return rows[0];
  } catch (error) {
    (0, _errorHandler.handleDatabaseError)(error);
  }
};
exports.createEvent = createEvent;