export type PostStatus = "published" | "trash";

export interface Post {
  id: number;
  title: string;
  status: PostStatus;
}

// In-memory data store
export const posts: Post[] = [
  { id: 1, title: "First post", status: "published" },
  { id: 2, title: "Second post", status: "published" },
  { id: 3, title: "Third post", status: "published" },
];

/** Returns a published post by id, or undefined if not found / in trash */
export function findById(id: number): Post | undefined {
  return posts.find((p) => p.id === id && p.status !== "trash");
}

/** Moves a post to trash (soft delete). Returns false if not found. */
export function softDelete(id: number): boolean {
  const post = posts.find((p) => p.id === id && p.status !== "trash");
  if (!post) return false;
  post.status = "trash";
  return true;
}

/** Permanently removes a post from the store. Returns false if not found. */
export function forceDelete(id: number): boolean {
  const index = posts.findIndex((p) => p.id === id && p.status !== "trash");
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
}

/** Resets the store to its initial state (used in tests) */
export function resetStore(): void {
  posts.length = 0;
  posts.push(
    { id: 1, title: "First post", status: "published" },
    { id: 2, title: "Second post", status: "published" },
    { id: 3, title: "Third post", status: "published" }
  );
}
