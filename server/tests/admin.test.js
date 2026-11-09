import request from "supertest";
import app from "../src/app.js";

describe("Trust Admin APIs", () => {
  test("should reject unauthenticated dashboard access", async () => {
    const res = await request(app).get("/api/admin/dashboard");

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated scheme management", async () => {
    const res = await request(app).get("/api/admin/schemes");

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated campaign management", async () => {
    const res = await request(app).get("/api/admin/campaigns");

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated reports", async () => {
    const res = await request(app).get("/api/admin/reports/donations");

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated Form 10BD export", async () => {
    const res = await request(app)
      .get("/api/admin/reports/form-10bd/export");

    expect(res.statusCode).toBe(401);
  });
});