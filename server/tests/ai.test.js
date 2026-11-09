import request from "supertest";
import app from "../src/app.js";

describe("AI APIs", () => {
  test("should reject unauthenticated draft generation", async () => {
    const res = await request(app)
      .post("/api/ai/schemes/SCH-014/summary-drafts")
      .send({
        noticeText: "Sample notice",
        sourceUrl: "https://example.gov.in",
        lastCheckedAt: "2026-11-09",
      });

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated draft listing", async () => {
    const res = await request(app).get("/api/ai/summary-drafts");

    expect(res.statusCode).toBe(401);
  });

  test("should reject unauthenticated draft approval", async () => {
    const res = await request(app)
      .patch("/api/ai/summary-drafts/invalid-id/review")
      .send({ decision: "APPROVED" });

    expect(res.statusCode).toBe(401);
  });
});