import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [profile, recentDonations, totalByStatus, totalItemsByCategory] = await Promise.all([
      prisma.donorProfile.findUnique({ where: { userId } }),

      prisma.donation.findMany({
        where: { donorId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          ngo: { select: { name: true, slug: true, city: true, logo: true } },
          items: true,
        },
      }),

      prisma.donation.groupBy({
        by: ["status"],
        where: { donorId: userId },
        _count: { id: true },
      }),

      prisma.donationItem.groupBy({
        by: ["category"],
        where: { donation: { donorId: userId } },
        _sum: { quantity: true },
      }),
    ]);

    // Calculate stats
    const totalDonations = await prisma.donation.count({ where: { donorId: userId } });
    const totalItems = await prisma.donationItem.aggregate({
      where: { donation: { donorId: userId } },
      _sum: { quantity: true },
    });
    const ngosHelped = await prisma.donation.findMany({
      where: { donorId: userId },
      select: { ngoId: true },
      distinct: ["ngoId"],
    });
    const distributedCount = await prisma.donation.count({
      where: { donorId: userId, status: "DISTRIBUTED" },
    });

    return NextResponse.json({
      profile,
      stats: {
        totalDonations,
        totalItems: totalItems._sum.quantity || 0,
        ngosHelped: ngosHelped.length,
        distributedCount,
        impactScore: profile?.impactScore || 0,
      },
      recentDonations,
      totalByStatus,
      totalItemsByCategory,
    });
  } catch (error) {
    console.error("Donor dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
