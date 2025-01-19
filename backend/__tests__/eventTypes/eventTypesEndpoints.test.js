import app from "../../app/app";
import db from "../../app/connection";
import seed from "../../app/db/seeds/seed";
import testData from "../../app/db/seeds/data/test/index";
import request from "supertest";

describe("EventTypes API", () => {
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

  describe("GET /api/event-types", () => {
    test("200 - GET: Returns an array of all event types", async () => {
      const response = await request(app).get("/api/event-types");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((eventType) => {
        expect(eventType).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        });
      });

      const eventTypeNames = response.body.map((type) => type.name);
      expect(eventTypeNames).toContain("Workshop");
      expect(eventTypeNames).toContain("Technology");
    });
  });

  describe("POST /api/admin/event-types", () => {
    test("201 - POST: creates and returns a new event type when authenticated as admin", async () => {
      const newEventType = {
        name: "New event type",
        description: "test event description",
      };
      const response = await request(app)
        .post("/api/admin/event-types")
        .set("user-role", "admin")
        .send(newEventType);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: "New event type",
        description: "test event description",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    test("400- POST: returns error when name is missing", async () => {
      const newEventType = {
        description: "test event description",
      };

      const response = await request(app)
        .post("/api/admin/event-types")
        .set("user-role", "admin")
        .send(newEventType);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Missing required field: name");
    });
    test("400- POST: returns error when name is missing", async () => {
      const newEventType = {
        name: "test event type",
      };

      const response = await request(app)
        .post("/api/admin/event-types")
        .set("user-role", "admin")
        .send(newEventType);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Missing required field: description");
    });
  });

  describe("PATCH /api/admin/event-types/:id", () => {
    test("200: updates and returns the event type", async () => {
      const updatedData = {
        name: "Updated name",
        description: "Updated description",
      };

      const response = await request(app)
        .patch(`/api/admin/event-types/1`)
        .set("user-role", "admin")
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        name: "Updated name",
        description: "Updated description",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    test("404: returns error when event type doesn't exist", async () => {
      const updatedData = {
        name: "Updated name",
        description: "Updated description",
      };

      const response = await request(app)
        .patch(`/api/admin/event-types/9999`)
        .set("user-role", "admin")
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event type not found");
    });
  });

  describe("DELETE /api/admin/event-types/:id", () => {
    test("204 - DELETE: deletes the event type when authenticated as admin", async () => {
      const response = await request(app)
        .delete("/api/admin/event-types/1")
        .set("user-role", "admin");

      expect(response.status).toBe(204);

      const checkDeleted = await db.query(
        "SELECT * FROM event_types WHERE id = $1",
        [1]
      );
      expect(checkDeleted.rows.length).toBe(0);
    });

    test("404 - DELETE: returns error when event type doesn't exist", async () => {
      const response = await request(app)
        .delete("/api/admin/event-types/9999")
        .set("user-role", "admin");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event type not found");
    });

    test("400 - DELETE: returns error when id is invalid", async () => {
      const response = await request(app)
        .delete("/api/admin/event-types/not-a-number")
        .set("user-role", "admin");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid event type ID");
    });

    test("403 - DELETE: returns error when not admin", async () => {
      const response = await request(app)
        .delete("/api/admin/event-types/1")
        .set("user-role", "user");

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You need to be an admin to carry out this action"
      );
    });
  });

  describe("GET /api/event-types/:id", () => {
    test("200 - GET: Returns a single event type when it exists", async () => {
      const response = await request(app).get("/api/event-types/1");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        name: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    test("404 - GET: Returns error when event type doesn't exist", async () => {
      const response = await request(app).get("/api/event-types/9999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event type not found");
    });

    test("400 - GET: Returns error when id is invalid", async () => {
      const response = await request(app).get("/api/event-types/not-a-number");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid event type ID");
    });
  });
});
