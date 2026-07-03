import { Post } from "../models/post";
 
// Store en memoria. Cuando el equipo agregue un ORM/DB real,
// esta es la única capa que hay que reemplazar (la interfaz de
// PostService no debería cambiar).
const posts: Post[] = [
  {
    id: 1,
    title: "Introducción a TypeScript",
    content: "TypeScript agrega tipado estático a JavaScript.",
    excerpt: "TypeScript agrega tipado estático...",
    slug: "introduccion-a-typescript",
    status: "publish",
    author_id: 1,
    created_at: "2026-06-01T10:00:00.000Z",
    updated_at: "2026-06-01T10:00:00.000Z",
    published_at: "2026-06-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Patrones de diseño en Node.js",
    content: "Repaso de patrones creacionales, estructurales y de comportamiento.",
    excerpt: "Repaso de patrones...",
    slug: "patrones-de-diseno-en-nodejs",
    status: "publish",
    author_id: 2,
    created_at: "2026-06-05T12:00:00.000Z",
    updated_at: "2026-06-06T09:00:00.000Z",
    published_at: "2026-06-06T09:00:00.000Z",
  },
  {
    id: 3,
    title: "Borrador sin publicar",
    content: "Todavía en progreso.",
    slug: "borrador-sin-publicar",
    status: "draft",
    author_id: 1,
    created_at: "2026-06-10T08:00:00.000Z",
    updated_at: "2026-06-10T08:00:00.000Z",
  },
  {
    id: 4,
    title: "Post archivado",
    content: "Contenido viejo, movido a la papelera.",
    slug: "post-archivado",
    status: "trash",
    author_id: 3,
    created_at: "2026-05-20T08:00:00.000Z",
    updated_at: "2026-05-25T08:00:00.000Z",
  },
  {
    id: 5,
    title: "Post eliminado (soft delete)",
    content: "Este no debería aparecer nunca en el Index.",
    slug: "post-eliminado",
    status: "publish",
    author_id: 2,
    created_at: "2026-05-15T08:00:00.000Z",
    updated_at: "2026-05-16T08:00:00.000Z",
    published_at: "2026-05-15T08:00:00.000Z",
    deleted_at: "2026-05-17T08:00:00.000Z",
  },
];
 
export function getAllPosts(): Post[] {
  // devolvemos copia para que nadie mute el store por fuera
  return posts.map((p) => ({ ...p }));
}
 
export function addPost(post: Post): Post {
  posts.push(post);
  return post;
}