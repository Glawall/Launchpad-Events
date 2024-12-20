export default [
  {
    title: "Community Meetup",
    description: "Monthly community gathering",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    end_date: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ),
    capacity: 100,
    location_name: "The Shard",
    location_address: "32 London Bridge St, London SE1 9SG",
    event_type_id: 1,
    creator_id: 1,
    status: "upcoming",
    timezone: "Europe/London",
  },
  {
    title: "Tech Workshop",
    description: "Learn new technologies",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    end_date: new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ),
    capacity: 50,
    location_name: "Google Academy London",
    location_address: "123 Buckingham Palace Rd, London SW1W 9SH",
    event_type_id: 2,
    creator_id: 1,
    status: "upcoming",
    timezone: "Europe/London",
  },
  {
    title: "Sports Tournament",
    description: "Annual sports competition",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    end_date: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
    ),
    capacity: 200,
    location_name: "Emirates Stadium",
    location_address: "Hornsey Rd, London N7 7AJ",
    event_type_id: 3,
    creator_id: 1,
    status: "upcoming",
    timezone: "Europe/London",
  },
];
