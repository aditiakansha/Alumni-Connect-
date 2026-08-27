import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("ChangeMe123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@alumniportal.test" },
    update: {},
    create: {
      email: "admin@alumniportal.test",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          fullName: "Portal Admin",
        },
      },
    },
  });

  console.log("Seeded admin user:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
