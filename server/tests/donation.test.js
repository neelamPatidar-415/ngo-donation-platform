import request from "supertest";
import app from "../src/app.js";

describe("Donation APIs", () => {
  test("should reject unauthenticated donation creation", async () => {
    const res = await request(app)
      .post("/api/donations")
      .send({
        campaignId: "CMP-001",
        amount: 500,
        frequency: "ONE_TIME",
      });

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated payment verification", async () => {
    const res = await request(app)
      .post("/api/donations/verify")
      .send({});

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated donation history", async () => {
    const res = await request(app).get("/api/donations/my");

    expect(res.statusCode).toBe(401);
  });
});