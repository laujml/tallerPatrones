import request from "supertest";
import app from "../app";
import { resetStore, findById, posts } from "../posts.store";

beforeEach(() => {
  resetStore();
});

describe("Spec 5 · DELETE /posts/:id", () => {
  it("soft-deletes the post by default (status becomes trash)", async () => {
    const res = await request(app).delete("/posts/1");

    expect(res.status).toBe(204);

    // Post should still be in the store but marked as trash
    const deletedPost = posts.find((p) => p.id === 1);
    expect(deletedPost).toBeDefined();
    expect(deletedPost?.status).toBe("trash");

    // Should no longer be visible via GET
    const getRes = await request(app).get("/posts/1");
    expect(getRes.status).toBe(404);
  });

  it("hard-deletes the post permanently when force=true", async () => {
    const res = await request(app).delete("/posts/2?force=true");

    expect(res.status).toBe(204);

    // Post must be completely removed from the store
    const deletedPost = posts.find((p) => p.id === 2);
    expect(deletedPost).toBeUndefined();
  });

  it("returns 404 when the post does not exist", async () => {
    const res = await request(app).delete("/posts/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Post no encontrado" });
  });
});
