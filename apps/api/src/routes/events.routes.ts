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

router.delete("/:id", requireAuth, async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id }, select: { createdById: true } });
  if (!event) return res.status(404).json({ message: "Event not found" });
  if (event.createdById !== req.user!.userId && req.user!.role !== "ADMIN") {
    return res.status(403).json({ message: "You can only delete events you created" });
  }
  await prisma.event.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
