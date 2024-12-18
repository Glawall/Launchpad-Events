import format from "pg-format";
import { readFileSync } from "fs";
import path from "path";
import db from "../../connection";
import testData from "./data/test/index";
import bcrypt from "bcryptjs";

const schemaFiles = [
  "users.sql",
  "event_types.sql",
  "events.sql",
  "event_attendees.sql",
];

const createTables = async () => {
  try {
    await db.query(`
      DROP TABLE IF EXISTS event_attendees CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS event_types CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    for (const file of schemaFiles) {
      const filePath = path.join(`${__dirname}/../../db/schema`, file);
      const sql = readFileSync(filePath, "utf-8");
      await db.query(sql);
    }
  } catch (error) {
    console.log(error);
  }
};

const seed = async () => {
  try {
    await createTables();

    const insertUsersStr = format(
      "INSERT INTO users (email, name, password_hash, role) VALUES %L;",
      await Promise.all(
        testData.users.map(async ({ email, name, password, role }) => [
          email,
          name,
          await bcrypt.hash(password, 10),
          role,
        ])
      )
    );

    await db.query(insertUsersStr);

    const insertEventTypesStr = format(
      "INSERT INTO event_types (name, description) VALUES %L",
      testData.eventTypes.map(({ name, description }) => [name, description])
    );

    await db.query(insertEventTypesStr);

    const insertEventsStr = format(
      `INSERT INTO events 
        (title, description, date, capacity, location_name, location_address, event_type_id, creator_id, status) 
       VALUES %L`,
      testData.events.map(
        ({
          title,
          description,
          date,
          capacity,
          location_name,
          location_address,
          event_type_id,
          creator_id,
          status,
        }) => [
          title,
          description,
          date,
          capacity,
          location_name,
          location_address,
          event_type_id,
          creator_id,
          status,
        ]
      )
    );

    await db.query(insertEventsStr);

    const insertAttendeesStr = format(
      "INSERT INTO event_attendees (event_id, user_id, added_to_calendar) VALUES %L",
      testData.attendees.map(({ event_id, user_id, added_to_calendar }) => [
        event_id,
        user_id,
        added_to_calendar,
      ])
    );

    await db.query(insertAttendeesStr);
  } catch (error) {
    console.log(error);
  }
};

export default seed;
