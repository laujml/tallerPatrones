import { Router, Request, Response } from "express";
import {
  findById,
  findBySlug,
  createPost,
  updatePost,
  VALID_STATUSES,
  PostStatus,
} from "../data/postsStore";

const router = Router();

// POST /posts
router.post("/posts", (req: Request, res: Response) => {
  const { title, content, excerpt, slug, status, author_id } = req.body;

  if (!title || !content || !slug || author_id === undefined) {
    res.status(400).json({ error: "title, content, slug y author_id son requeridos" });
    return;
  }

  if (findBySlug(slug)) {
    res.status(409).json({ error: "El slug ya existe" });
    return;
  }

  const resolvedStatus: PostStatus = status ?? "draft";

  if (!VALID_STATUSES.includes(resolvedStatus)) {
    res.status(400).json({ error: `status inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  const now = new Date().toISOString();
  const post = createPost({
    title,
    content,
    excerpt,
    slug,
    status: resolvedStatus,
    author_id,
    ...(resolvedStatus === "publish" ? { published_at: now } : {}),
    ...(resolvedStatus === "trash" ? { deleted_at: now } : {}),
  });

  res.status(201).json(post);
});

// PUT /posts/:id
router.put("/posts/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = findById(id);

  if (!existing) {
    res.status(404).json({ error: "Post no encontrado" });
    return;
  }

  const { title, content, excerpt, slug, status, author_id } = req.body;

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: `status inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}` });
      return;
    }
    // No se puede pasar de trash a publish directamente
    if (existing.status === "trash" && status === "publish") {
      res.status(400).json({ error: "No se puede publicar un post en trash. Cambiá el estado a draft primero." });
      return;
    }
  }

  if (slug !== undefined && slug !== existing.slug && findBySlug(slug)) {
    res.status(409).json({ error: "El slug ya existe" });
    return;
  }

  const now = new Date().toISOString();
  const changes: Partial<typeof existing> = {};

  if (title !== undefined) changes.title = title;
  if (content !== undefined) changes.content = content;
  if (excerpt !== undefined) changes.excerpt = excerpt;
  if (slug !== undefined) changes.slug = slug;
  if (author_id !== undefined) changes.author_id = author_id;

  if (status !== undefined) {
    changes.status = status;
    if (status === "publish" && !existing.published_at) {
      changes.published_at = now;
    }
    if (status === "trash" && !existing.deleted_at) {
      changes.deleted_at = now;
    }
  }

  const updated = updatePost(id, changes);
  res.status(200).json(updated);
});

// PATCH /posts/:id — misma lógica que PUT (actualización parcial)
router.patch("/posts/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = findById(id);

  if (!existing) {
    res.status(404).json({ error: "Post no encontrado" });
    return;
  }

  const { title, content, excerpt, slug, status, author_id } = req.body;

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: `status inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}` });
      return;
    }
    if (existing.status === "trash" && status === "publish") {
      res.status(400).json({ error: "No se puede publicar un post en trash. Cambiá el estado a draft primero." });
      return;
    }
  }

  if (slug !== undefined && slug !== existing.slug && findBySlug(slug)) {
    res.status(409).json({ error: "El slug ya existe" });
    return;
  }

  const now = new Date().toISOString();
  const changes: Partial<typeof existing> = {};

  if (title !== undefined) changes.title = title;
  if (content !== undefined) changes.content = content;
  if (excerpt !== undefined) changes.excerpt = excerpt;
  if (slug !== undefined) changes.slug = slug;
  if (author_id !== undefined) changes.author_id = author_id;

  if (status !== undefined) {
    changes.status = status;
    if (status === "publish" && !existing.published_at) {
      changes.published_at = now;
    }
    if (status === "trash" && !existing.deleted_at) {
      changes.deleted_at = now;
    }
  }

  const updated = updatePost(id, changes);
  res.status(200).json(updated);
});

export default router;
