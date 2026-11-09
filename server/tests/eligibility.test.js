import request from "supertest";
import app from "../src/app.js";

describe("Eligibility APIs", () => {
  test("should return eligibility questions", async () => {
    const res = await request(app).get("/api/eligibility/questions");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should return eligibility results", async () => {
    const res = await request(app)
      .post("/api/eligibility/check")
      .send({
        age: 35,
        maritalStatus: "widow",
        hasBplCard: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("possibleMatches");
    expect(res.body.data).toHaveProperty("otherSchemes");
  });
});