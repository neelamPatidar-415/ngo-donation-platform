import request from "supertest";
import app from "../src/app.js";

describe("Receipt APIs", () => {
  test("should reject unauthenticated receipt history", async () => {
    const res = await request(app).get("/api/receipts/my");

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated PDF download", async () => {
    const res = await request(app)
      .get("/api/receipts/invalid-donation-id/pdf");

    expect(res.statusCode).toBe(401);
  });
});