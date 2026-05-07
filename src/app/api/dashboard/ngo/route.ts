import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "NGO_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ngo = await prisma.nGO.findUnique({ where: { adminId: session.user.id } });
    if (!ngo) return NextResponse.json({ error: "NGO not found" }, { status: 404 });

    const [
      pendingDonations, totalDonations, recentDonations,
      activeCampaigns, donationsByStatus, itemsByCategory,
      recentReviews
    ] = await Promise.all([
      prisma.donation.count({ where: { ngoId: ngo.id, status: "PENDING" } }),
      prisma.donation.count({ where: { ngoId: ngo.id } }),
      prisma.donation.findMany({
        where: { ngoId: ngo.id },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          donor: { select: { name: true, email: true } },
          items: true,
          _count: { select: { items: true } },
        },
      }),
      prisma.campaign.count({ where: { ngoId: ngo.id, isActive: true } }),
      prisma.donation.groupBy({
        by: ["status"],
        where: { ngoId: ngo.id },
        _count: { id: true },
      }),
      prisma.donationItem.groupBy({
        by: ["category"],
        where: { donation: { ngoId: ngo.id } },
        _sum: { quantity: true },
      }),
      prisma.review.findMany({
        where: { ngoId: ngo.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { donor: { select: { name: true } } },
      }),
    ]);

    return NextResponse.json({
      ngo,
      stats: {
        pendingDonations,
        totalDonations,
        activeCampaigns,
        totalReceived: ngo.totalReceived,
        totalDistributed: ngo.totalDistributed,
        rating: ngo.rating,
        reviewCount: ngo.reviewCount,
      },
      recentDonations,
      donationsByStatus,
      itemsByCategory,
      recentReviews,
    });
  } catch (error) {
    console.error("NGO dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
