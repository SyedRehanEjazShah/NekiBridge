import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "PLATFORM_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers, totalDonors, totalNGOAdmins,
      totalNGOs, verifiedNGOs,
      totalDonations, totalItems, distributedItems,
      activeCampaigns, totalCampaigns,
      donationsByStatus, recentDonations, recentUsers,
      topNGOs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "DONOR" } }),
      prisma.user.count({ where: { role: "NGO_ADMIN" } }),
      prisma.nGO.count(),
      prisma.nGO.count({ where: { isVerified: true } }),
      prisma.donation.count(),
      prisma.donationItem.aggregate({ _sum: { quantity: true } }),
      prisma.donationItem.aggregate({ where: { isDistributed: true }, _sum: { quantity: true } }),
      prisma.campaign.count({ where: { isActive: true } }),
      prisma.campaign.count(),
      prisma.donation.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          donor: { select: { name: true, email: true } },
          ngo: { select: { name: true, city: true } },
        },
      }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 10, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.nGO.findMany({ orderBy: { totalDistributed: "desc" }, take: 5, select: { id: true, name: true, city: true, totalReceived: true, totalDistributed: true, rating: true, isVerified: true } }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers, totalDonors, totalNGOAdmins,
        totalNGOs, verifiedNGOs,
        totalDonations,
        totalItems: totalItems._sum.quantity || 0,
        distributedItems: distributedItems._sum.quantity || 0,
        activeCampaigns, totalCampaigns,
      },
      donationsByStatus,
      recentDonations,
      recentUsers,
      topNGOs,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch admin dashboard" }, { status: 500 });
  }
}
