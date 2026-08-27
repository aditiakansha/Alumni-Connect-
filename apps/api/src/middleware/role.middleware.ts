import { NextFunction, Request, Response } from "express";

// Role-based access control. Use after requireAuth.
// Example: router.delete("/:id", requireAuth, requireRole("ADMIN"), handler)
export function requireRole(...allowedRoles: Array<"ADMIN" | "ALUMNI" | "STUDENT">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
