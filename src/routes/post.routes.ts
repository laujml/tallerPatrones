import { Router } from "express";
import { index } from "../controllers/post.controller";
 
const router = Router();
 
router.get("/", index);
 
export default router;
 