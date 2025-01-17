import app from "../../app/app";
import db from "../../app/connection";
import seed from "../../app/db/seeds/seed";
import testData from "../../app/db/seeds/data/test/index";
import request from "supertest";
import jwt from "jsonwebtoken";

describe("POST /api/auth/login", () => {
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

  describe("Successful login", () => {
    test("200: Returns JWT token with user data for valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "admin123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

      const decodedToken = jwt.verify(response.body, "SECRET_KEY");
      expect(decodedToken).toMatchObject({
        email: "admin@example.com",
        id: expect.any(Number),
        role: expect.any(String),
        name: expect.any(String),
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
    });
  });

  describe("Failed login attempts", () => {
    test("400: Returns error when email is missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "admin123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email and password are required");
    });

    test("400: Returns error when password is missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email and password are required");
    });

    test("401: Returns error for invalid password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
      expect(response.body).not.toHaveProperty("token");
    });

    test("401: Returns error for non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "admin123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
      expect(response.body).not.toHaveProperty("token");
    });
  });

  describe("Token validation", () => {
    test("Token expires after 1 hour", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "admin123",
      });

      const token = response.body;
      const decodedToken = jwt.verify(token, "SECRET_KEY");

      // Check token expiration
      const expirationTime = new Date(decodedToken.exp * 1000);
      const issueTime = new Date(decodedToken.iat * 1000);
      const difference = expirationTime - issueTime;

      // Should be 1 hour (with small margin for test execution time)
      expect(difference).toBeLessThanOrEqual(3600000); // 1 hour in milliseconds
      expect(difference).toBeGreaterThan(3500000); // Allow for slight test delay
    });

    test("Token contains correct user email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "admin123",
      });

      const token = response.body;
      const decodedToken = jwt.verify(token, "SECRET_KEY");

      expect(decodedToken.email).toBe("admin@example.com");
    });
  });
});
