import request from "supertest";
import app from "../app";
import { resetStore } from "../data/postsStore";

beforeEach(() => {
  resetStore();
});

const validPost = {
  title: "Mi primer post",
  content: "Contenido del post",
  slug: "mi-primer-post",
  author_id: 1,
};

// ─── POST /posts ───────────────────────────────────────────────────────────────

describe("POST /posts", () => {
  it("crea un post con datos válidos y responde 201", async () => {
    const res = await request(app).post("/posts").send(validPost);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 1,
      title: validPost.title,
      content: validPost.content,
      slug: validPost.slug,
      author_id: validPost.author_id,
      status: "draft",
    });
    expect(res.body.created_at).toBeDefined();
    expect(res.body.updated_at).toBeDefined();
  });

  it("usa 'draft' como status por defecto", async () => {
    const res = await request(app).post("/posts").send(validPost);
    expect(res.body.status).toBe("draft");
  });

  it("acepta status explícito válido", async () => {
    const res = await request(app).post("/posts").send({ ...validPost, status: "pending" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
  });

  it("setea published_at si se crea con status publish", async () => {
    const res = await request(app).post("/posts").send({ ...validPost, status: "publish" });
    expect(res.status).toBe(201);
    expect(res.body.published_at).toBeDefined();
  });

  it("retorna 400 si falta title", async () => {
    const { title, ...body } = validPost;
    const res = await request(app).post("/posts").send(body);
    expect(res.status).toBe(400);
  });

  it("retorna 400 si falta content", async () => {
    const { content, ...body } = validPost;
    const res = await request(app).post("/posts").send(body);
    expect(res.status).toBe(400);
  });

  it("retorna 400 si falta slug", async () => {
    const { slug, ...body } = validPost;
    const res = await request(app).post("/posts").send(body);
    expect(res.status).toBe(400);
  });

  it("retorna 400 si falta author_id", async () => {
    const { author_id, ...body } = validPost;
    const res = await request(app).post("/posts").send(body);
    expect(res.status).toBe(400);
  });

  it("retorna 400 si el status es inválido", async () => {
    const res = await request(app).post("/posts").send({ ...validPost, status: "invalido" });
    expect(res.status).toBe(400);
  });

  it("retorna 409 si el slug ya existe", async () => {
    await request(app).post("/posts").send(validPost);
    const res = await request(app).post("/posts").send({ ...validPost, title: "Otro título" });
    expect(res.status).toBe(409);
  });
});

// ─── PUT /posts/:id ────────────────────────────────────────────────────────────

describe("PUT /posts/:id", () => {
  it("actualiza un post existente y responde 200", async () => {
    await request(app).post("/posts").send(validPost);
    const res = await request(app).put("/posts/1").send({ title: "Título actualizado" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Título actualizado");
  });

  it("actualiza updated_at al modificar", async () => {
    await request(app).post("/posts").send(validPost);
    const created = (await request(app).put("/posts/1").send({ title: "x" })).body;
    expect(created.updated_at).toBeDefined();
  });

  it("retorna 404 si el id no existe", async () => {
    const res = await request(app).put("/posts/999").send({ title: "x" });
    expect(res.status).toBe(404);
  });

  it("setea published_at al pasar a status publish", async () => {
    await request(app).post("/posts").send(validPost);
    const res = await request(app).put("/posts/1").send({ status: "publish" });
    expect(res.status).toBe(200);
    expect(res.body.published_at).toBeDefined();
  });

  it("setea deleted_at al pasar a status trash", async () => {
    await request(app).post("/posts").send(validPost);
    const res = await request(app).put("/posts/1").send({ status: "trash" });
    expect(res.status).toBe(200);
    expect(res.body.deleted_at).toBeDefined();
  });

  it("retorna 400 al intentar publicar un post en trash directamente", async () => {
    await request(app).post("/posts").send({ ...validPost, status: "trash" });
    const res = await request(app).put("/posts/1").send({ status: "publish" });
    expect(res.status).toBe(400);
  });

  it("retorna 400 si el status es inválido", async () => {
    await request(app).post("/posts").send(validPost);
    const res = await request(app).put("/posts/1").send({ status: "invalido" });
    expect(res.status).toBe(400);
  });

  it("retorna 409 si el nuevo slug ya lo usa otro post", async () => {
    await request(app).post("/posts").send(validPost);
    await request(app).post("/posts").send({ ...validPost, slug: "segundo-post" });
    const res = await request(app).put("/posts/1").send({ slug: "segundo-post" });
    expect(res.status).toBe(409);
  });
});

// ─── PATCH /posts/:id ─────────────────────────────────────────────────────────

describe("PATCH /posts/:id", () => {
  it("actualiza parcialmente un post y responde 200", async () => {
    await request(app).post("/posts").send(validPost);
    const res = await request(app).patch("/posts/1").send({ content: "Nuevo contenido" });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Nuevo contenido");
    expect(res.body.title).toBe(validPost.title);
  });

  it("retorna 404 si el id no existe", async () => {
    const res = await request(app).patch("/posts/999").send({ title: "x" });
    expect(res.status).toBe(404);
  });
});
