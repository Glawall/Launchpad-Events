export function createGoogleCalendarUrl(event) {
  const startDate = new Date(event.date);
  const endDate = new Date(event.end_date);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: `${event.description}\n\nLocation: ${event.location_name} - ${event.location_address}`,
    location: event.location_address,
    dates: `${startDate.toISOString().replace(/-|:|\.\d+/g, "")}/${endDate
      .toISOString()
      .replace(/-|:|\.\d+/g, "")}`,
    sf: true,
    output: "xml",
    authuser: 0,
    pli: 1,
    usp: "sharing",
  });

  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
}
