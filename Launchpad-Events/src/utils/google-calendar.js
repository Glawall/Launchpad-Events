const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;

export const initGoogleApi = async () => {
  await new Promise((resolve) => gapi.load("client", resolve));

  await gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    prompt: "consent",
  });
};

export const addEventToCalendar = async (event) => {
  await new Promise((resolve, reject) => {
    try {
      tokenClient.callback = async (resp) => {
        if (resp.error) reject(resp);
        resolve(resp);
      };
      tokenClient.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });

  // Create the event data
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

  // Instead of directly inserting, get the URL to open the event in Google Calendar
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendarEvent.summary,
    details: calendarEvent.description,
    location: calendarEvent.location,
    dates: `${calendarEvent.start.dateTime.replace(
      /[-:]/g,
      ""
    )}/${calendarEvent.end.dateTime.replace(/[-:]/g, "")}`,
    authuser: 0,
  });

  // Open Google Calendar in a new tab
  window.open(
    `https://calendar.google.com/calendar/render?${params.toString()}`,
    "_blank"
  );
};
