import { Post, PostStatus, posts as sharedPosts } from "../data/postsStore";
 
export interface PostFilters {
  status?: PostStatus;
  author_id?: number;
  search?: string;
}
 
export type SortableField = "created_at" | "updated_at" | "title" | "status";
 
export interface PostPagination {
  page: number;
  limit: number;
  sortBy: SortableField;
  order: "asc" | "desc";
}
 
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
 
const SORTABLE_FIELDS: SortableField[] = [
  "created_at",
  "updated_at",
  "title",
  "status",
];
 
export function isSortableField(value: string): value is SortableField {
  return (SORTABLE_FIELDS as string[]).includes(value);
}
 
export function listPosts(
  filters: PostFilters,
  pagination: PostPagination
): PaginatedResult<Post> {
  // Leemos del store COMPARTIDO (data/postsStore.ts) para que lo creado
  // vía POST/PUT (Persona 4) aparezca acá también. Copiamos el array
  // para no mutar el store por accidente al ordenar/filtrar.
  let result = sharedPosts
    .map((p) => ({ ...p }))
    .filter((p) => !p.deleted_at);
 
  if (filters.status) {
    result = result.filter((p) => p.status === filters.status);
  }
 
  if (filters.author_id !== undefined) {
    result = result.filter((p) => p.author_id === filters.author_id);
  }
 
  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term)
    );
  }
 
  const { sortBy, order } = pagination;
  result = result.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
 
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
  const start = (pagination.page - 1) * pagination.limit;
  const paged = result.slice(start, start + pagination.limit);
 
  return {
    data: paged,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
    },
  };
}