import request from "supertest";
import app from "../app";
import { resetStore } from "../posts.store";

beforeEach(() => {
  resetStore();
});

describe("Spec 2 · GET /posts/:id", () => {
  it("returns 200 with the post when it exists", async () => {
    const res = await request(app).get("/posts/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, title: "First post" });
  });

  it("returns 404 when the post does not exist", async () => {
    const res = await request(app).get("/posts/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Post no encontrado" });
  });
});
