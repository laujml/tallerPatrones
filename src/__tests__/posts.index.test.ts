import request from "supertest";
import app from "../app";
import { resetStore, createPost } from "../data/postsStore";
 
beforeEach(() => {
  resetStore();
 
  createPost({
    title: "Introducción a TypeScript",
    content: "TypeScript agrega tipado estático a JavaScript.",
    slug: "introduccion-a-typescript",
    status: "publish",
    author_id: 1,
  });
  createPost({
    title: "Patrones de diseño en Node.js",
    content: "Repaso de patrones creacionales, estructurales y de comportamiento.",
    slug: "patrones-de-diseno-en-nodejs",
    status: "publish",
    author_id: 2,
  });
  createPost({
    title: "Borrador sin publicar",
    content: "Todavía en progreso.",
    slug: "borrador-sin-publicar",
    status: "draft",
    author_id: 1,
  });
  createPost({
    title: "Post eliminado (soft delete)",
    content: "Este no debería aparecer nunca en el Index.",
    slug: "post-eliminado",
    status: "publish",
    author_id: 2,
    deleted_at: new Date().toISOString(),
  });
});
 
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
 
  it("un post creado vía POST /posts aparece en GET /posts", async () => {
    await request(app).post("/posts").send({
      title: "Post creado en runtime",
      content: "Contenido de prueba de integración",
      slug: "post-creado-en-runtime",
      author_id: 5,
      status: "publish",
    });
 
    const res = await request(app).get("/posts?search=runtime");
    expect(res.status).toBe(200);
    expect(res.body.data.some((p: any) => p.slug === "post-creado-en-runtime")).toBe(
      true
    );
  });
});
 