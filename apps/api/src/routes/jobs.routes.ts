import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { prisma } from "@alumni/db";

const router = Router();

// GET /api/jobs — list active postings
router.get("/", requireAuth, async (_req, res) => {
  const jobs = await prisma.job.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  res.json(jobs);
});

// POST /api/jobs — alumni/admin can post
router.post("/", requireAuth, requireRole("ALUMNI", "ADMIN"), async (req, res) => {
  const job = await prisma.job.create({ data: { ...req.body, postedById: req.user!.userId } });
  res.status(201).json(job);
});

export default router;
