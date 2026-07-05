export type PostStatus = "draft" | "publish" | "pending" | "private" | "trash";

export type Post = {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: PostStatus;
  author_id: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  deleted_at?: string;
};

export const VALID_STATUSES: PostStatus[] = [
  "draft",
  "publish",
  "pending",
  "private",
  "trash",
];

let nextId = 1;
export const posts: Post[] = [];

export function findById(id: number): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function findBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function createPost(data: Omit<Post, "id" | "created_at" | "updated_at">): Post {
  const now = new Date().toISOString();
  const post: Post = { ...data, id: nextId++, created_at: now, updated_at: now };
  posts.push(post);
  return post;
}

export function updatePost(id: number, data: Partial<Omit<Post, "id" | "created_at">>): Post {
  const index = posts.findIndex((p) => p.id === id);
  const updated: Post = { ...posts[index], ...data, updated_at: new Date().toISOString() };
  posts[index] = updated;
  return updated;
}

export function resetStore(): void {
  posts.length = 0;
  nextId = 1;
}
