import app from "../../app/app";
import db from "../../app/connection";
import seed from "../../app/db/seeds/seed";
import testData from "../../app/db/seeds/data/test/index";
import request from "supertest";

describe("GET /api/events/:id", () => {
  beforeEach(async () => {
    await db.query("BEGIN");
    await seed(db, testData);
  });

  afterEach(async () => {
    await db.query("ROLLBACK");
  });

  afterAll(async () => {
    await db.end();
  });

  test("200 - GET: responds with single event and attendees when it exists", async () => {
    const response = await request(app).get("/api/events/1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      title: testData.events[0].title,
      description: testData.events[0].description,
      location_name: testData.events[0].location_name,
      location_address: testData.events[0].location_address,
      capacity: testData.events[0].capacity,
      event_type_name: expect.any(String),
      creator_name: expect.any(String),
      status: "upcoming",
      timezone: "Europe/London",
      attendees: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          added_to_calendar: expect.any(Boolean),
          joined_at: expect.any(String),
        }),
      ]),
    });

    expect(response.body.attendees).toHaveLength(3);
  });

  test("200 - GET: responds with empty attendees array when event has no attendees", async () => {
    const response = await request(app).get("/api/events/2");

    const expectedEvent = testData.events[1];

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      title: expectedEvent.title,
      description: expectedEvent.description,
      attendees: [],
    });
  });

  test("200 - GET: attendees are ordered by join date", async () => {
    const response = await request(app).get("/api/events/1");

    expect(response.status).toBe(200);
    expect(response.body.attendees).toHaveLength(3);

    expect(response.body.attendees[0].id).toBe(1);
    expect(response.body.attendees[1].id).toBe(2);
  });

  test("404 - GET: responds with error when event does not exist", async () => {
    const response = await request(app).get("/api/events/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Event not found");
  });

  test("400 - GET: responds with error when event id is invalid", async () => {
    const response = await request(app).get("/api/events/not-a-number");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid event ID");
  });

  describe("POST /api/events/:eventId/users/:userId/attendees", () => {
    test("201 - POST: User can attend an event", async () => {
      const response = await request(app)
        .post("/api/events/2/users/3/attendees")
        .set("user-role", "user")
        .set("user-id", "3");

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        event_id: 2,
        user_id: 3,
        created_at: expect.any(String),
      });
    });

    test("201 - POST: Admin can attend an event", async () => {
      const response = await request(app)
        .post("/api/events/2/users/1/attendees")
        .set("user-role", "admin")
        .set("user-id", "1");

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        event_id: 2,
        user_id: 1,
        created_at: expect.any(String),
      });
    });

    test("400 - POST: Cannot attend event that is at capacity", async () => {
      await db.query(`UPDATE events SET capacity = 1 WHERE id = 2`);
      await request(app)
        .post("/api/events/2/users/3/attendees")
        .set("user-role", "user")
        .set("user-id", "3");

      const response = await request(app)
        .post("/api/events/2/users/4/attendees")
        .set("user-role", "user")
        .set("user-id", "4");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Event is at full capacity");
    });

    test("400 - POST: Cannot attend same event twice", async () => {
      await request(app)
        .post("/api/events/2/users/3/attendees")
        .set("user-role", "user")
        .set("user-id", "3");

      const response = await request(app)
        .post("/api/events/2/users/3/attendees")
        .set("user-role", "user")
        .set("user-id", "3");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "User is already attending this event"
      );
    });

    test("404 - POST: Cannot attend non-existent event", async () => {
      const response = await request(app)
        .post("/api/events/999/users/3/attendees")
        .set("user-role", "user")
        .set("user-id", "3");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });

    test("401 - POST: Cannot attend when not authenticated", async () => {
      const response = await request(app).post(
        "/api/events/2/users/3/attendees"
      );

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("You need to be signed in");
    });

    test("403 - POST: Cannot manage attendance for other users", async () => {
      const response = await request(app)
        .post("/api/events/2/users/4/attendees")
        .set("user-role", "user")
        .set("user-id", "3");

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You can only manage your own attendance"
      );
    });
  });
});
