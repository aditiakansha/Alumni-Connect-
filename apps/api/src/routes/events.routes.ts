import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { prisma } from "@alumni/db";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const events = await prisma.event.findMany({ orderBy: { startDate: "asc" } });
  res.json(events);
});

router.post("/", requireAuth, requireRole("ALUMNI", "ADMIN"), async (req, res) => {
  const event = await prisma.event.create({ data: { ...req.body, createdById: req.user!.userId } });
  res.status(201).json(event);
});

router.post("/:id/rsvp", requireAuth, async (req, res) => {
  const rsvp = await prisma.eventRSVP.upsert({
    where: { eventId_userId: { eventId: req.params.id, userId: req.user!.userId } },
    update: { status: req.body.status },
    create: { eventId: req.params.id, userId: req.user!.userId, status: req.body.status },
  });
  res.json(rsvp);
});

export default router;
