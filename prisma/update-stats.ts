import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statsMap: Record<string, { totalReceived: number; totalDistributed: number; reviewCount: number; rating: number }> = {
  "edhi-foundation":        { totalReceived: 120, totalDistributed: 85,  reviewCount: 24, rating: 4.9 },
  "akhuwat-clothes-bank":   { totalReceived: 95,  totalDistributed: 62,  reviewCount: 18, rating: 4.8 },
  "al-khidmat-foundation":  { totalReceived: 78,  totalDistributed: 48,  reviewCount: 12, rating: 4.7 },
  "chhipa-welfare":         { totalReceived: 55,  totalDistributed: 35,  reviewCount: 9,  rating: 4.8 },
  "baitussalam-welfare":    { totalReceived: 40,  totalDistributed: 28,  reviewCount: 7,  rating: 4.6 },
  "jdc-foundation":         { totalReceived: 32,  totalDistributed: 22,  reviewCount: 6,  rating: 4.5 },
  "shauoor-welfare":        { totalReceived: 25,  totalDistributed: 18,  reviewCount: 5,  rating: 4.4 },
  "tars-foundation":        { totalReceived: 20,  totalDistributed: 14,  reviewCount: 4,  rating: 4.3 },
  "saylani-welfare":        { totalReceived: 85,  totalDistributed: 58,  reviewCount: 15, rating: 4.7 },
  "alamgir-welfare":        { totalReceived: 28,  totalDistributed: 20,  reviewCount: 5,  rating: 4.5 },
  "pakistan-sweet-homes":    { totalReceived: 45,  totalDistributed: 30,  reviewCount: 8,  rating: 4.6 },
  "al-mustafa-welfare":     { totalReceived: 22,  totalDistributed: 15,  reviewCount: 4,  rating: 4.4 },
  "rizq-trust":             { totalReceived: 12,  totalDistributed: 8,   reviewCount: 3,  rating: 4.2 },
  "sundas-foundation":      { totalReceived: 8,   totalDistributed: 5,   reviewCount: 2,  rating: 4.1 },
  "kashf-foundation":       { totalReceived: 6,   totalDistributed: 4,   reviewCount: 1,  rating: 4.0 },
};

async function main() {
  console.log("📊 Updating NGO stats to new-platform numbers...\n");

  for (const [slug, stats] of Object.entries(statsMap)) {
    const result = await prisma.nGO.updateMany({
      where: { slug },
      data: stats,
    });
    console.log(`  ✅ ${slug}: ${result.count > 0 ? "updated" : "not found"}`);
  }

  console.log("\n🎉 All stats updated!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
