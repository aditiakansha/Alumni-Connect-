import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { prisma } from "@alumni/db";

const router = Router();

// Everything under /api/admin requires ADMIN role.
router.use(requireAuth, requireRole("ADMIN"));

router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({ include: { profile: true } });
  res.json(users);
});

router.patch("/users/:id/role", async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
  res.json(user);
});

router.patch("/users/:id/deactivate", async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json(user);
});

export default router;
