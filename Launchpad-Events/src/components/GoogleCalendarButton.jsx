import { createGoogleCalendarUrl } from "../utils/calendar-utils";

export default function GoogleCalendarButton({ event, className = "" }) {
  return (
    <a
      href={createGoogleCalendarUrl(event)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-calendar ${className}`}
    >
      Add to Google Calendar
    </a>
  );
}
