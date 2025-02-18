import app from "../../app/app";
import db from "../../app/connection";
import seed from "../../app/db/seeds/seed";
import testData from "../../app/db/seeds/data/test/index";
import request from "supertest";

describe("GET /api/users/:id", () => {
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
  test("200 - GET: admin can access any user profile", async () => {
    const response = await request(app)
      .get("/api/users/2")
      .set("user-role", "admin")
      .set("user-id", "1");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      name: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
    });
  });

  test("200 - GET: user can access their own profile", async () => {
    const response = await request(app)
      .get("/api/users/1")
      .set("user-role", "user")
      .set("user-id", "1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      name: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
    });
  });
  test("401 - GET: responds with error when not authenticated", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("You need to be signed in");
  });

  test("403 - GET: user cannot access other user profiles", async () => {
    const response = await request(app)
      .get("/api/users/2")
      .set("user-role", "user")
      .set("user-id", "1");

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("You can only access your own profile");
  });
  test("404 - GET: responds with error when user not found", async () => {
    const response = await request(app)
      .get("/api/users/999")
      .set("user-role", "admin")
      .set("user-id", "1");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  test("400 - GET: responds with error when user id is invalid", async () => {
    const response = await request(app)
      .get("/api/users/not-a-number")
      .set("user-role", "admin")
      .set("user-id", "1");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid user ID");
  });

  test("400 - GET: responds with error when user-id header is invalid", async () => {
    const response = await request(app)
      .get("/api/users/1")
      .set("user-role", "user")
      .set("user-id", "not-a-number");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid user ID");
  });
  test("200 - GET: returns user with correct properties", async () => {
    const response = await request(app)
      .get("/api/users/1")
      .set("user-role", "user")
      .set("user-id", "1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      name: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });

    expect(response.body).not.toHaveProperty("password");
    expect(response.body).not.toHaveProperty("password_hash");
  });

  describe("GET /api/users", () => {
    test("200 - GET: Responds with all users", async () => {
      const response = await request(app).get("/api/users");

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
    });

    test("200 - GET: Responds with all users ordered by created_at DESC", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      const dates = response.body.map((user) =>
        new Date(user.created_at).getTime()
      );
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).toEqual(sortedDates);
    });
  });

  describe("DELETE /api/users/:id", () => {
    test("204 - DELETE: successfully deletes own profile", async () => {
      const response = await request(app)
        .delete("/api/users/2")
        .set("user-role", "user")
        .set("user-id", "2");

      expect(response.status).toBe(204);

      const checkResponse = await request(app)
        .get("/api/admin/users/2")
        .set("user-role", "admin");
      expect(checkResponse.status).toBe(404);
    });

    test("204 - DELETE: admin can delete any user", async () => {
      const response = await request(app)
        .delete("/api/users/2")
        .set("user-role", "admin")
        .set("user-id", "1");

      expect(response.status).toBe(204);
    });

    test("403 - DELETE: cannot delete other users profile", async () => {
      const response = await request(app)
        .delete("/api/users/2")
        .set("user-role", "user")
        .set("user-id", "3");

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You can only access your own profile"
      );
    });

    test("401 - DELETE: responds with error when not authenticated", async () => {
      const response = await request(app).delete("/api/users/2");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("You need to be signed in");
    });

    test("404 - DELETE: responds with error when user not found", async () => {
      const response = await request(app)
        .delete("/api/users/999")
        .set("user-role", "admin")
        .set("user-id", "1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });
  describe("POST /api/users", () => {
    test("201: creates a new user successfully", async () => {
      const newUser = {
        email: "test@example.com",
        name: "Test User",
        password: "test123!",
      };

      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      expect(response.body.user).toMatchObject({
        id: expect.any(Number),
        email: newUser.email,
        name: newUser.name,
        role: "user",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });

      const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
        newUser.email,
      ]);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        email: newUser.email,
        name: newUser.name,
        role: "user",
      });
      expect(rows[0].password_hash).toBeDefined();
      expect(rows[0].password_hash).not.toBe(newUser.password);
    });

    test("400: returns error when email is missing", async () => {
      const invalidUser = {
        name: "Test User",
        password: "test123!",
      };

      const response = await request(app)
        .post("/api/users")
        .send(invalidUser)
        .expect(400);

      expect(response.body.message).toBe(
        "Email, name, and password are required"
      );
    });

    test("400: returns error when name is missing", async () => {
      const invalidUser = {
        email: "test@example.com",
        password: "test123!",
      };

      const response = await request(app)
        .post("/api/users")
        .send(invalidUser)
        .expect(400);

      expect(response.body.message).toBe(
        "Email, name, and password are required"
      );
    });

    test("400: returns error when password is missing", async () => {
      const invalidUser = {
        email: "test@example.com",
        name: "Test User",
      };

      const response = await request(app)
        .post("/api/users")
        .send(invalidUser)
        .expect(400);

      expect(response.body.message).toBe(
        "Email, name, and password are required"
      );
    });

    test("500: returns error when user already exists", async () => {
      const existingUser = {
        email: "test@example.com",
        name: "Test User",
        password: "test123!",
      };

      await request(app).post("/api/users").send(existingUser);

      const response = await request(app)
        .post("/api/users")
        .send(existingUser)
        .expect(500);

      expect(response.body.message).toBe("Duplicate entry found");
    });

    test("400: returns error for invalid email format", async () => {
      const invalidUser = {
        email: "not-an-email",
        name: "Test User",
        password: "test123!",
      };

      const response = await request(app)
        .post("/api/users")
        .send(invalidUser)
        .expect(400);

      expect(response.body.message).toBe("Invalid email format");
    });
  });
});
