import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminAccessCode = process.env.ADMIN_ACCESS_CODE;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminAccessCode || !adminPassword) {
    throw new Error(
      "ADMIN_ACCESS_CODE dan ADMIN_PASSWORD harus tersedia di file .env"
    );
  }

  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (existingAdmin) {
    console.log("Akun admin sudah ada. Tidak membuat admin baru.");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      accessCode: adminAccessCode,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Akun admin berhasil dibuat.");
  console.log(`Access Code: ${adminAccessCode}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });