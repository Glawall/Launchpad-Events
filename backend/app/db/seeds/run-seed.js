import db from "../../connection.js";
import { users, events, attendees, eventTypes } from "./data/test";
import seed from "./seed";

const runSeed = async () => {
  try {
    const { eventTypesRows, userRows, eventRows, attendeeRows } = await seed(
      db,
      {
        eventTypeData: eventTypes,
        userData: users,
        eventData: events,
        attendeeData: attendees,
      }
    );

    console.log(`Inserted ${eventTypesRows.length} event_types`);
    console.log(`Inserted ${userRows.length} users`);
    console.log(`Inserted ${eventRows.length} events`);
    console.log(`Inserted ${attendeeRows.length} attendees`);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await db.end();
  }
};

if (require.main === module) {
  runSeed()
    .then(() => {
      console.log("Database seeded successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error seeding database:", error);
      process.exit(1);
    });
}

module.exports = runSeed;
