import { Router, Request, Response } from "express";
import { findById, softDelete, forceDelete } from "./posts.store";

const router = Router();

/**
 * Spec 2 · Show
 * GET /posts/:id
 * - 200 OK  → returns { id, title } for a published post
 * - 404 Not Found → post does not exist or is in trash
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(404).json({ error: "Post no encontrado" });
    return;
  }

  const post = findById(id);

  if (!post) {
    res.status(404).json({ error: "Post no encontrado" });
    return;
  }

  res.status(200).json({ id: post.id, title: post.title });
});

/**
 * Spec 5 · Delete
 * DELETE /posts/:id
 * - Default (no query param)  → soft delete: status = 'trash', 204 No Content
 * - ?force=true               → hard delete: record removed permanently, 204 No Content
 * - Post not found            → 404 Not Found
 */
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(404).json({ error: "Post no encontrado" });
    return;
  }

  const force = req.query.force === "true";

  const success = force ? forceDelete(id) : softDelete(id);

  if (!success) {
    res.status(404).json({ error: "Post no encontrado" });
    return;
  }

  res.status(204).send();
});

export default router;
