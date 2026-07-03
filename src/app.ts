import express from "express";
import postRoutes from "./routes/post.routes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/posts", postRoutes);

export default app;