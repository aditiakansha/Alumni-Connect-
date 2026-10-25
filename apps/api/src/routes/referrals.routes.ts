import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "@alumni/db";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const requests = await prisma.referralRequest.findMany({ where: { requesterId: req.user!.userId }, orderBy: { createdAt: "desc" } });
  res.json(requests);
});

router.post("/requests", requireAuth, async (req, res) => {
  const { contactKey, contactName, contactRole, contactCompany, contactLinkedinUrl, targetRole, targetCompany, message } = req.body;
  if (!contactKey || !contactName || !targetRole) return res.status(400).json({ message: "Select an alumni contact and add the role you need help with" });
  const request = await prisma.referralRequest.create({
    data: { requesterId: req.user!.userId, contactKey, contactName, contactRole, contactCompany, contactLinkedinUrl, targetRole, targetCompany, message },
  });
  res.status(201).json(request);
});

router.delete("/requests/:id", requireAuth, async (req, res) => {
  const request = await prisma.referralRequest.findFirst({ where: { id: req.params.id, requesterId: req.user!.userId } });
  if (!request) return res.status(404).json({ message: "Referral request not found" });
  await prisma.referralRequest.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

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

router.patch("/requests/:id", requireAuth, async (req, res) => {
  const request = await prisma.referralRequest.findFirst({ where: { id: req.params.id, requesterId: req.user!.userId } });
  if (!request) return res.status(404).json({ message: "Referral request not found" });
  const updated = await prisma.referralRequest.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json(updated);
});

export default router;
