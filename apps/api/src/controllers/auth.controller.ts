import { Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@alumni/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { signAccessToken } from "../utils/jwt";
import { verifyGoogleToken } from "../utils/googleAuth";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  role: z.enum(["ADMIN", "ALUMNI", "STUDENT"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const googleLoginSchema = z.object({
  idToken: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  }
  const { email, password, fullName, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: role ?? "STUDENT", // admins should be promoted manually / via seed, not self-registration
      profile: { create: { fullName } },
    },
  });

  const token = signAccessToken({ userId: user.id, role: user.role });
  return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signAccessToken({ userId: user.id, role: user.role });
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}

export async function googleLogin(req: Request, res: Response) {
  const parsed = googleLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const { idToken } = parsed.data;

  let googleUser;
  try {
    googleUser = await verifyGoogleToken(idToken);
  } catch (err) {
    console.error("Google token verification failed:", err);
    return res.status(401).json({ message: "Invalid Google token" });
  }

  if (!googleUser.emailVerified) {
    return res.status(401).json({ message: "Google email not verified" });
  }

  let user = await prisma.user.findUnique({
    where: { email: googleUser.email },
    include: { profile: true },
  });

  if (!user) {
    // No account yet — create one. Random unusable password hash since this
    // account only ever authenticates via Google, never email/password.
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await hashPassword(randomPassword);

    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        passwordHash,
        role: "STUDENT",
        profile: {
          create: {
            fullName: googleUser.name,
            avatarUrl: googleUser.picture,
          },
        },
      },
      include: { profile: true },
    });
  }

  if (!user) {
    return res.status(500).json({ message: "Unable to create or load user" });
  }

  const token = signAccessToken({ userId: user.id, role: user.role });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.profile?.fullName ?? googleUser.name,
      avatarUrl: user.profile?.avatarUrl ?? googleUser.picture,
    },
  });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: { profile: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const { passwordHash, ...safeUser } = user;
  return res.json(safeUser);
}
