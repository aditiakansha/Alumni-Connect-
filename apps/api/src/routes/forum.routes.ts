import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "@alumni/db";

const router = Router();
const userSelect = { id: true, email: true, role: true };

router.get("/", requireAuth, async (req, res) => {
  let posts = await prisma.forumPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: userSelect }, comments: { orderBy: { createdAt: "asc" }, include: { author: { select: userSelect } } } },
  });
  if (posts.length === 0) {
    await prisma.forumPost.createMany({
      data: [
        { title: "What helped you move into product leadership?", category: "Career", content: "Looking for honest lessons from alumni who made the transition from engineering into product.", authorId: req.user!.userId },
        { title: "Alumni meetup in Bengaluru this month", category: "Community", content: "Would love to find a good evening for an informal meetup near campus and Indiranagar.", authorId: req.user!.userId },
      ],
    });
    posts = await prisma.forumPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: userSelect }, comments: { orderBy: { createdAt: "asc" }, include: { author: { select: userSelect } } } },
    });
  }
  res.json(posts);
});

router.post("/", requireAuth, async (req, res) => {
  const post = await prisma.forumPost.create({
    data: { title: String(req.body.title || "").trim(), content: String(req.body.content || "").trim(), category: req.body.category ? String(req.body.category) : null, authorId: req.user!.userId },
    include: { author: { select: userSelect }, comments: true },
  });
  res.status(201).json(post);
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const comment = await prisma.forumComment.create({
    data: { content: req.body.content, postId: req.params.id, authorId: req.user!.userId },
    include: { author: { select: userSelect } },
  });
  res.status(201).json(comment);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const post = await prisma.forumPost.findUnique({ where: { id: req.params.id }, select: { authorId: true } });
  if (!post) return res.status(404).json({ message: "Discussion not found" });
  if (post.authorId !== req.user!.userId) return res.status(403).json({ message: "You can only delete your own discussions" });
  await prisma.forumPost.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

router.delete("/:postId/comments/:commentId", requireAuth, async (req, res) => {
  const comment = await prisma.forumComment.findUnique({ where: { id: req.params.commentId }, select: { authorId: true, postId: true } });
  if (!comment || comment.postId !== req.params.postId) return res.status(404).json({ message: "Reply not found" });
  if (comment.authorId !== req.user!.userId) return res.status(403).json({ message: "You can only delete your own replies" });
  await prisma.forumComment.delete({ where: { id: req.params.commentId } });
  res.status(204).send();
});

export default router;
