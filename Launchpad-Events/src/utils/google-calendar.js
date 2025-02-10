const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;

export const initGoogleApi = async () => {
  await new Promise((resolve) => gapi.load("client:auth2", resolve));
  await gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    clientId: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
  });
};

export const addEventToCalendar = async (event) => {
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    await gapi.auth2.getAuthInstance().signIn({
      prompt: "consent",
    });
  }

  const calendarEvent = {
    summary: event.title,
    description: event.description,
    location: `${event.location_name} - ${event.location_address}`,
    start: {
      dateTime: new Date(event.date).toISOString(),
      timeZone: "Europe/London",
    },
    end: {
      dateTime: new Date(event.end_date).toISOString(),
      timeZone: "Europe/London",
    },
  };

  await gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: calendarEvent,
  });
};
