import express from "express";
import postsRouter from "./routes/posts";
import postIndexRoutes from "./routes/post.routes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/posts", postIndexRoutes); // GET /posts (Persona 2)
app.use(postsRouter); // POST/PUT/PATCH /posts, /posts/:id (Persona 4)

export default app;