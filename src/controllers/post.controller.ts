import { Request, Response } from "express";
import {
  listPosts,
  isSortableField,
  PostFilters,
  PostPagination,
} from "../services/post.service";
import { PostStatus, VALID_STATUSES } from "../data/postsStore";
 
// Formato de error propuesto (alinear con el resto del equipo si
// Foundation define uno oficial más adelante):
// { "error": { "message": string, "code": string } }
function badRequest(res: Response, message: string) {
  return res.status(400).json({
    error: { message, code: "INVALID_QUERY_PARAM" },
  });
}
 
export function index(req: Request, res: Response) {
  const {
    page = "1",
    limit = "10",
    status,
    author_id,
    search,
    sortBy = "created_at",
    order = "desc",
  } = req.query as Record<string, string>;
 
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    return badRequest(res, "'page' debe ser un entero positivo.");
  }
 
  let limitNum = Number(limit);
  if (!Number.isInteger(limitNum) || limitNum < 1) {
    return badRequest(res, "'limit' debe ser un entero positivo.");
  }
  if (limitNum > 100) limitNum = 100; // cap silencioso
 
  if (status && !VALID_STATUSES.includes(status as PostStatus)) {
    return badRequest(
      res,
      `'status' inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}.`
    );
  }
 
  let authorIdNum: number | undefined;
  if (author_id !== undefined) {
    authorIdNum = Number(author_id);
    if (!Number.isInteger(authorIdNum)) {
      return badRequest(res, "'author_id' debe ser un entero.");
    }
  }
 
  if (!isSortableField(sortBy)) {
    return badRequest(res, `'sortBy' inválido: ${sortBy}.`);
  }
 
  if (order !== "asc" && order !== "desc") {
    return badRequest(res, "'order' debe ser 'asc' o 'desc'.");
  }
 
  const filters: PostFilters = {
    status: status as PostStatus | undefined,
    author_id: authorIdNum,
    search,
  };
 
  const pagination: PostPagination = {
    page: pageNum,
    limit: limitNum,
    sortBy,
    order,
  };
 
  const result = listPosts(filters, pagination);
  return res.status(200).json(result);
}
 