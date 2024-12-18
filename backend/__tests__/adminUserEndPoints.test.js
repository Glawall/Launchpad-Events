import app from "../app/app";
import db from "../app/connection";
import seed from "../app/db/seeds/seed";
import testData from "../app/db/seeds/data/test/index";
import request from "supertest";

describe("Admin Users API", () => {
  beforeEach(async () => {
    await seed(db, testData);
  });

  afterAll(async () => {
    await db.end();
  });

  describe("GET /api/admin/users", () => {
    test("200 - GET: Responds with all users when authenticated as admin", async () => {
      const adminUser = testData.users.find((user) => user.role === "admin");
      expect(adminUser).toBeTruthy();

      const response = await request(app)
        .get("/api/admin/users")
        .set("user-role", "admin");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(5);

      expect(response.body[0]).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        name: expect.any(String),
        role: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });

      const returnedAdminUser = response.body.find(
        (user) => user.role === "admin"
      );
      expect(returnedAdminUser.email).toBe(adminUser.email);
      expect(returnedAdminUser.name).toBe(adminUser.name);
    });

    test("200 - GET: Responds with all users ordered by created_at DESC", async () => {
      const response = await request(app)
        .get("/api/admin/users")
        .set("user-role", "admin");

      expect(response.status).toBe(200);

      const dates = response.body.map((user) =>
        new Date(user.created_at).getTime()
      );
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).toEqual(sortedDates);
    });

    test("403 - GET: Responds with 403 when not authorised as admin", async () => {
      const response = await request(app)
        .get("/api/admin/users")
        .set("user-role", "user");

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "Only an admin can access this information"
      );
    });

    test("401 - GET responds with 401 when not authenticated", async () => {
      const response = await request(app).get("/api/admin/users");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("You need to be signed in");
    });
  });
});
