import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const logoMap: Record<string, string> = {
  "edhi-foundation": "/logos/edhi-foundation.png",
  "akhuwat-clothes-bank": "/logos/akhuwat-clothes-bank.png",
  "al-khidmat-foundation": "/logos/al-khidmat-foundation.png",
  "chhipa-welfare": "/logos/chhipa-welfare.png",
  "baitussalam-welfare": "/logos/baitussalam-welfare.png",
  "jdc-foundation": "/logos/jdc-foundation.png",
  "shauoor-welfare": "/logos/shauoor-welfare.png",
  "tars-foundation": "/logos/tars-foundation.png",
  "saylani-welfare": "/logos/saylani-welfare.png",
  "alamgir-welfare": "/logos/alamgir-welfare.png",
  "pakistan-sweet-homes": "/logos/pakistan-sweet-homes.png",
  "al-mustafa-welfare": "/logos/al-mustafa-welfare.png",
  "rizq-trust": "/logos/rizq-trust.png",
  "sundas-foundation": "/logos/sundas-foundation.png",
  "kashf-foundation": "/logos/kashf-foundation.png",
};

async function main() {
  console.log("🖼️  Updating NGO logos...\n");

  for (const [slug, logo] of Object.entries(logoMap)) {
    const result = await prisma.nGO.updateMany({
      where: { slug },
      data: { logo },
    });
    console.log(`  ✅ ${slug}: ${result.count > 0 ? "updated" : "not found"}`);
  }

  console.log("\n🎉 All logos updated!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
