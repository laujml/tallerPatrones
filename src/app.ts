import express from "express";
import postsRouter from "./routes/posts";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(postsRouter);

export default app;