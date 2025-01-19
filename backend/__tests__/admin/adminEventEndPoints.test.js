import app from "../../app/app";
import db from "../../app/connection";
import seed from "../../app/db/seeds/seed";
import testData from "../../app/db/seeds/data/test/index";
import request from "supertest";

describe("Admin Events API", () => {
  beforeEach(async () => {
    await db.query("BEGIN");
    await seed(testData);
  });

  afterEach(async () => {
    await db.query("ROLLBACK");
  });

  afterAll(async () => {
    await db.end();
  });

  describe("POST /api/admin/events", () => {
    test("201 - POST: Creates new event when authenticated as admin", async () => {
      const newEvent = {
        title: "New Event",
        description: "Test Description",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
        ),
        capacity: 50,
        location_name: "WeWork Waterhouse Square",
        location_address: "138 Holborn, London EC1N 2SW",
        event_type_id: 1,
        creator_id: 1,
      };

      const response = await request(app)
        .post("/api/admin/events")
        .set("user-role", "admin")
        .send(newEvent);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: newEvent.title,
        description: newEvent.description,
        capacity: newEvent.capacity,
        location_name: newEvent.location_name,
        location_address: newEvent.location_address,
        status: "upcoming",
        timezone: "Europe/London",
      });
    });

    test("403 - POST: Responds with 403 when not authorised as admin", async () => {
      const response = await request(app)
        .post("/api/admin/events")
        .set("user-role", "user")
        .send({});

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You need to be an admin to carry out this action"
      );
    });

    test("401 - POST: responds with 401 when not authenticated", async () => {
      const response = await request(app).post("/api/admin/events").send({});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("You need to be signed in");
    });

    test("400 - POST: Responds with an error when mandatory fields are not filled in", async () => {
      const invalidEvent = {
        title: "Missing Required Fields",
      };

      const response = await request(app)
        .post("/api/admin/events")
        .set("user-role", "admin")
        .send(invalidEvent);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch("Missing required field");
    });

    test("400 - POST: Responds with an error when event date is not in the future", async () => {
      const pastEvent = {
        title: "Past Event",
        description: "Test Description",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() - 20 * 60 * 60 * 1000),
        capacity: 50,
        location_name: "WeWork Waterhouse Square",
        location_address: "138 Holborn, London EC1N 2SW",
        event_type_id: 1,
        creator_id: 1,
      };

      const response = await request(app)
        .post("/api/admin/events")
        .set("user-role", "admin")
        .send(pastEvent);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Event date must be in the future");
    });

    test("400 - POST: Responds with an error when capacity is not a postive number", async () => {
      const invalidCapacity = {
        title: "Invalid Capacity",
        description: "Test Description",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
        ),
        capacity: -1,
        location_name: "WeWork Waterhouse Square",
        location_address: "138 Holborn, London EC1N 2SW",
        event_type_id: 1,
        creator_id: 1,
      };

      const response = await request(app)
        .post("/api/admin/events")
        .set("user-role", "admin")
        .send(invalidCapacity);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Capacity must be a positive number");
    });
  });

  describe("PATCH /api/admin/events/:id", () => {
    test("200 - PATCH: responds with updated event when admin", async () => {
      const updateData = {
        title: "Updated Event",
        description: "Updated Description",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
        ),
        capacity: 75,
        location_name: "Updated Venue",
        location_address: "456 Update St, London EC1N 2SW",
        event_type_id: 1,
        creator_id: 1,
        status: "upcoming",
      };

      const response = await request(app)
        .patch("/api/admin/events/1")
        .set("user-role", "admin")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        title: updateData.title,
        description: updateData.description,
        capacity: updateData.capacity,
        location_name: updateData.location_name,
        location_address: updateData.location_address,
        creator_id: updateData.creator_id,
        status: "upcoming",
        timezone: "Europe/London",
      });
    });

    test("404 - PATCH: responds with error when event not found", async () => {
      const response = await request(app)
        .patch("/api/admin/events/999")
        .set("user-role", "admin")
        .send({
          title: "Not Found Event",
          description: "Test Description",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          end_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
          ),
          capacity: 50,
          location_name: "Test Venue",
          location_address: "123 Test St",
          event_type_id: 1,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });

    test("403 - PATCH: responds with error when not admin", async () => {
      const response = await request(app)
        .patch("/api/admin/events/1")
        .set("user-role", "user")
        .send({});

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You need to be an admin to carry out this action"
      );
    });

    test("400 - PATCH: responds with error when update data is invalid", async () => {
      const invalidUpdate = {
        title: "Invalid Update",
        description: "Test Description",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
        ),
        capacity: -1,
        location_name: "Test Venue",
        location_address: "123 Test St",
        event_type_id: 1,
        creator_id: 1,
      };

      const response = await request(app)
        .patch("/api/admin/events/1")
        .set("user-role", "admin")
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Capacity must be a positive number");
    });

    test("401 - PATCH: responds with error when not authenticated", async () => {
      const updateData = {
        title: "Updated Event",
        description: "Updated Description",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
        ),
        capacity: 75,
        location_name: "Updated Venue",
        location_address: "456 Update St, London EC1N 2SW",
        event_type_id: 1,
        creator_id: 1,
        status: "upcoming",
      };
      const response = await request(app)
        .patch("/api/admin/events/1")
        .send(updateData);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("You need to be signed in");
    });
  });

  describe("DELETE /api/admin/events/:id", () => {
    test("204 - DELETE: successfully deletes event and its attendees", async () => {
      const eventResponse = await request(app)
        .get("/api/events/1")
        .set("user-role", "admin");
      expect(eventResponse.body.attendees.length).toBeGreaterThan(0);

      const response = await request(app)
        .delete("/api/admin/events/1")
        .set("user-role", "admin");

      expect(response.status).toBe(204);

      const checkEventResponse = await request(app).get("/api/events/1");
      expect(checkEventResponse.status).toBe(404);

      const { rows: attendees } = await db.query(
        "SELECT * FROM event_attendees WHERE event_id = 1"
      );
      expect(attendees.length).toBe(0);
    });

    test("404 - DELETE: responds with error when event does not exist", async () => {
      const response = await request(app)
        .delete("/api/admin/events/999")
        .set("user-role", "admin");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });

    test("403 - DELETE: responds with error when not admin", async () => {
      const response = await request(app)
        .delete("/api/admin/events/1")
        .set("user-role", "user");

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You need to be an admin to carry out this action"
      );
    });

    test("401 - DELETE: responds with error when not authenticated", async () => {
      const response = await request(app).delete("/api/admin/events/1");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("You need to be signed in");
    });

    test("400 - DELETE: responds with error when event id is invalid", async () => {
      const response = await request(app)
        .delete("/api/admin/events/not-a-number")
        .set("user-role", "admin");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid event ID");
    });
  });
});
