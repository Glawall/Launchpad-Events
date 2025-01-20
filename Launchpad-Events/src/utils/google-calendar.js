const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient;

export const initGoogleApi = () => {
  return new Promise((resolve) => {
    gapi.load("client", async () => {
      await gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      });

      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: resolve,
      });
    });
  });
};

export const addEventToCalendar = async (event) => {
  try {
    // Request access token
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

    const calendarEvent = {
      summary: event.title,
      description: event.description,
      location: event.location_address,
      start: {
        dateTime: new Date(event.date).toISOString(),
      },
      end: {
        dateTime: new Date(event.end_date).toISOString(),
      },
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: calendarEvent,
    });

    return response.result;
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    throw new Error("Failed to add event to calendar");
  }
};
