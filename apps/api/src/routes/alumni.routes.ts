import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "@alumni/db";
import { z } from "zod";

const router = Router();

const profileSchema = z.object({
  role: z.enum(["STUDENT", "ALUMNI"]),
  fullName: z.string().trim().min(1).max(120),
  avatarUrl: z.string().trim().max(500).optional().or(z.literal("")),
  graduationYear: z.number().int().min(1900).max(2100).optional().nullable(),
  degree: z.string().trim().max(160).optional().or(z.literal("")),
  branch: z.string().trim().max(160).optional().or(z.literal("")),
  currentCompany: z.string().trim().max(160).optional().or(z.literal("")),
  currentPosition: z.string().trim().max(160).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
});

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
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Please check your profile details" });

  const { role, ...profileFields } = parsed.data;
  const data = {
    ...profileFields,
    avatarUrl: parsed.data.avatarUrl || null,
    degree: parsed.data.degree || null,
    branch: parsed.data.branch || null,
    currentCompany: parsed.data.currentCompany || null,
    currentPosition: parsed.data.currentPosition || null,
    location: parsed.data.location || null,
    bio: parsed.data.bio || null,
    linkedinUrl: parsed.data.linkedinUrl || null,
  };

  const [, updated] = await prisma.$transaction([
    prisma.user.update({ where: { id: req.user!.userId }, data: { role } }),
    prisma.profile.upsert({
      where: { userId: req.user!.userId },
      create: { userId: req.user!.userId, ...data },
      update: data,
    }),
  ]);
  res.json(updated);
});

export default router;
