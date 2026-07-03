import request from "supertest";
import app from "../app";
 
describe("GET /posts", () => {
  it("devuelve 200 con defaults (page=1, limit=10)", async () => {
    const res = await request(app).get("/posts");
    expect(res.status).toBe(200);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(10);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
 
  it("excluye posts con soft delete (deleted_at)", async () => {
    const res = await request(app).get("/posts");
    const titles = res.body.data.map((p: any) => p.title);
    expect(titles).not.toContain("Post eliminado (soft delete)");
  });
 
  it("filtra por status=publish", async () => {
    const res = await request(app).get("/posts?status=publish");
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: any) => p.status === "publish")).toBe(
      true
    );
  });
 
  it("filtra por author_id", async () => {
    const res = await request(app).get("/posts?author_id=1");
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: any) => p.author_id === 1)).toBe(true);
  });
 
  it("busca por texto parcial en title/content", async () => {
    const res = await request(app).get("/posts?search=TypeScript");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
 
  it("pagina correctamente", async () => {
    const res = await request(app).get("/posts?page=1&limit=2");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.meta.limit).toBe(2);
  });
 
  it("capea limit a 100", async () => {
    const res = await request(app).get("/posts?limit=9999");
    expect(res.status).toBe(200);
    expect(res.body.meta.limit).toBe(100);
  });
 
  it("responde 400 si sortBy es inválido", async () => {
    const res = await request(app).get("/posts?sortBy=campoInvalido");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
 
  it("responde 400 si page es negativo", async () => {
    const res = await request(app).get("/posts?page=-1");
    expect(res.status).toBe(400);
  });
 
  it("responde 400 si status es inválido", async () => {
    const res = await request(app).get("/posts?status=noexiste");
    expect(res.status).toBe(400);
  });
 
  it("responde 400 si author_id no es numérico", async () => {
    const res = await request(app).get("/posts?author_id=abc");
    expect(res.status).toBe(400);
  });
});