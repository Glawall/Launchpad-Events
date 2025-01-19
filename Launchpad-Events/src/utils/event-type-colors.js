export const EVENT_TYPE_COLORS = {
  workshop: "#93c5fd", // Light blue - matches btn-blue
  seminar: "#86efac", // Light green - matches btn-calendar
  networking: "#fca5a5", // Light red - matches btn-red
  conference: "#c4b5fd", // Light purple
  meeting: "#fdba74", // Light orange
  training: "#a5b4fc", // Light indigo
  webinar: "#f9a8d4", // Light pink
  social: "#fcd34d", // Light yellow
  presentation: "#67e8f9", // Light cyan
  default: "#e5e7eb", // Light gray
};

export function getEventTypeColor(typeName) {
  const normalizedType = typeName?.toLowerCase().replace(/\s+/g, "");
  return EVENT_TYPE_COLORS[normalizedType] || EVENT_TYPE_COLORS.default;
}
