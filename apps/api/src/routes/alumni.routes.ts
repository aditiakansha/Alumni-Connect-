import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "@alumni/db";

const router = Router();

// GET /api/alumni — directory listing, filterable by graduationYear/branch/company
router.get("/", requireAuth, async (req, res) => {
  const { graduationYear, branch } = req.query;
  const profiles = await prisma.profile.findMany({
    where: {
      graduationYear: graduationYear ? Number(graduationYear) : undefined,
      branch: branch ? String(branch) : undefined,
    },
    include: { user: { select: { id: true, email: true, role: true } } },
  });
  res.json(profiles);
});

// GET /api/alumni/:id — single alumni profile
router.get("/:id", requireAuth, async (req, res) => {
  const profile = await prisma.profile.findUnique({ where: { id: req.params.id } });
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.json(profile);
});

// PUT /api/alumni/me — update own profile (implement ownership check against req.user.userId)
router.put("/me", requireAuth, async (req, res) => {
  const updated = await prisma.profile.update({
    where: { userId: req.user!.userId },
    data: req.body,
  });
  res.json(updated);
});

export default router;
