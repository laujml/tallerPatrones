// Reexportamos los tipos desde el store compartido (data/postsStore.ts)
// para que todo el equipo use la misma fuente de verdad del modelo,
// en vez de mantener una copia duplicada acá.
export type { Post, PostStatus } from "../data/postsStore";