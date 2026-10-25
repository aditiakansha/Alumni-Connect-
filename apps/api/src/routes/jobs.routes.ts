import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { prisma } from "@alumni/db";

const router = Router();

router.get("/applications", requireAuth, async (req, res) => {
  const applications = await prisma.jobApplication.findMany({ where: { requesterId: req.user!.userId }, orderBy: { appliedAt: "desc" } });
  res.json(applications);
});

router.post("/applications", requireAuth, async (req, res) => {
  const { jobKey, jobTitle, company, resumeName, resumeData } = req.body;
  if (!jobKey || !jobTitle || !company || !resumeName || !resumeData) return res.status(400).json({ message: "Job and resume are required" });
  if (String(resumeData).length > 12_000_000) return res.status(413).json({ message: "Resume file is too large" });
  const application = await prisma.jobApplication.upsert({
    where: { requesterId_jobKey: { requesterId: req.user!.userId, jobKey } },
    create: { requesterId: req.user!.userId, jobKey, jobTitle, company, resumeName, resumeData },
    update: { jobTitle, company, resumeName, resumeData, appliedAt: new Date() },
  });
  res.status(201).json(application);
});

router.delete("/applications/:jobKey", requireAuth, async (req, res) => {
  const application = await prisma.jobApplication.findUnique({ where: { requesterId_jobKey: { requesterId: req.user!.userId, jobKey: req.params.jobKey } } });
  if (!application) return res.status(404).json({ message: "Application not found" });
  await prisma.jobApplication.delete({ where: { id: application.id } });
  res.status(204).send();
});

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
