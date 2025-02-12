export const EVENT_TYPE_COLORS = {
  workshop: "#2C6E49", // Dark green
  hackathon: "#9B111E", // Dark red
  conference: "#fecf17", // Dark yellow
  meetup: "#1E3A5F", // Dark purple
  seminar: "#7A3E8C", // Medium gray
  default: "#3b474a", // Primary
};

export function getEventTypeColor(typeName) {
  const normalizedType = typeName?.toLowerCase().replace(/\s+/g, "");
  return EVENT_TYPE_COLORS[normalizedType] || EVENT_TYPE_COLORS.default;
}
