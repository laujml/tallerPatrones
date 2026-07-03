import express from "express";
import postsRouter from "./posts.router";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/posts", postsRouter);

export default app;