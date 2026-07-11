import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";

import { prisma } from "../lib/prisma.js";
import { Role, UserStatus } from "../../generated/prisma/enums.js";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const main = async () => {
  const email = "admin@gearup.com";
  const password = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists:", email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("Admin created successfully:", admin.email);
};

main()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
