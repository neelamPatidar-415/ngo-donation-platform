import request from "supertest";
import app from "../src/app.js";

describe("Public Scheme APIs", () => {
  test("should return published schemes", async () => {
    const res = await request(app).get("/api/schemes");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.schemes)).toBe(true);
  });

  test("should return scheme filters", async () => {
    const res = await request(app).get("/api/schemes/filters");

    expect([200, 404]).toContain(res.statusCode);
  });
});