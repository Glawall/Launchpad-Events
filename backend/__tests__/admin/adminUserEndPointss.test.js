import app from "../../app/app";
import db from "../../app/connection";
import seed from "../../app/db/seeds/seed";
import testData from "../../app/db/seeds/data/test/index";
import request from "supertest";

describe("Admin Users API", () => {
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

  describe("PATCH /api/admin/users/:id", () => {
    test("200 - PATCH: successfully updates user role when admin", async () => {
      const response = await request(app)
        .patch("/api/admin/users/2")
        .set("user-role", "admin")
        .send({ role: "admin" });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 2,
        role: "admin",
      });
    });

    test("400 - PATCH: responds with error when role is invalid", async () => {
      const response = await request(app)
        .patch("/api/admin/users/2")
        .set("user-role", "admin")
        .send({ role: "superuser" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Invalid role. Must be either "admin" or "user"'
      );
    });

    test("404 - PATCH: responds with error when user not found", async () => {
      const response = await request(app)
        .patch("/api/admin/users/999")
        .set("user-role", "admin")
        .send({ role: "admin" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    test("403 - PATCH: responds with error when not admin", async () => {
      const response = await request(app)
        .patch("/api/admin/users/2")
        .set("user-role", "user")
        .send({ role: "admin" });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You need to be an admin to carry out this action"
      );
    });

    test("401 - PATCH: responds with error when not authenticated", async () => {
      const response = await request(app)
        .patch("/api/admin/users/2")
        .send({ role: "admin" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("You need to be signed in");
    });

    test("400 - PATCH: responds with error when user id is invalid", async () => {
      const response = await request(app)
        .patch("/api/admin/users/not-a-number")
        .set("user-role", "admin")
        .send({ role: "admin" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid user ID");
    });
  });
});
