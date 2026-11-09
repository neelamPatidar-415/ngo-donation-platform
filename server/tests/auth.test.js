import request from "supertest";
import app from "../src/app.js";

describe("Authentication APIs", () => {
  test("should reject login with missing credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect([400, 422]).toContain(res.statusCode);
  });

  test("should reject registration with missing details", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({});

    expect([400, 422]).toContain(res.statusCode);
  });

  test("should reject unauthenticated profile access", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBe(401);
  });
});