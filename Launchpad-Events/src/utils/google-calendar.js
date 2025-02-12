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
    include_granted_scopes: false,
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

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: `${event.location_name} - ${event.location_address}`,
    dates: `${new Date(event.date)
      .toISOString()
      .replace(/[-:.]/g, "")}/${new Date(event.end_date)
      .toISOString()
      .replace(/[-:.]/g, "")}`,
  });

  window.open(
    `https://calendar.google.com/calendar/event?${params.toString()}`,
    "_blank"
  );
};
