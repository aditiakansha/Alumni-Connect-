import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "@alumni/db";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const posts = await prisma.forumPost.findMany({ orderBy: { createdAt: "desc" }, include: { author: true } });
  res.json(posts);
});

router.post("/", requireAuth, async (req, res) => {
  const post = await prisma.forumPost.create({ data: { ...req.body, authorId: req.user!.userId } });
  res.status(201).json(post);
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const comment = await prisma.forumComment.create({
    data: { content: req.body.content, postId: req.params.id, authorId: req.user!.userId },
  });
  res.status(201).json(comment);
});

export default router;
