import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "@alumni/db";

const router = Router();

// POST /api/referrals — student/alumni requests a referral for a job
router.post("/", requireAuth, async (req, res) => {
  const { jobId, alumniId, message } = req.body;
  const referral = await prisma.referral.create({
    data: { jobId, alumniId, message, requesterId: req.user!.userId },
  });
  res.status(201).json(referral);
});

// PATCH /api/referrals/:id — alumni accepts/rejects
router.patch("/:id", requireAuth, async (req, res) => {
  const { status } = req.body; // "ACCEPTED" | "REJECTED"
  const referral = await prisma.referral.update({ where: { id: req.params.id }, data: { status } });
  res.json(referral);
});

export default router;
