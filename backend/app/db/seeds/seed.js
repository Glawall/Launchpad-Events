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

const seed = async ({ eventTypes, events, users, attendees }) => {
  try {
    await createTables();
    console.log(users.password);
    const insertUsersStr = format(
      "INSERT INTO users (email, name, password_hash, role) VALUES %L;",
      await Promise.all(
        users.map(async ({ email, name, password, role }) => [
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
      eventTypes.map(({ name, description }) => [name, description])
    );

    await db.query(insertEventTypesStr);

    const insertEventsStr = format(
      `INSERT INTO events (
        title, 
        description, 
        date, 
        end_date,
        capacity, 
        location_name, 
        location_address, 
        event_type_id, 
        creator_id, 
        status,
        timezone
      ) VALUES %L`,
      events.map(
        ({
          title,
          description,
          date,
          end_date,
          capacity,
          location_name,
          location_address,
          event_type_id,
          creator_id,
          status,
          timezone,
        }) => [
          title,
          description,
          date,
          end_date || new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000),
          capacity,
          location_name,
          location_address,
          event_type_id,
          creator_id,
          status || "upcoming",
          timezone || "Europe/London",
        ]
      )
    );

    await db.query(insertEventsStr);

    const insertAttendeesStr = format(
      "INSERT INTO event_attendees (event_id, user_id, added_to_calendar) VALUES %L",
      attendees.map(({ event_id, user_id, added_to_calendar }) => [
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
