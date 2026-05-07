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

    // Get all received (not yet distributed) items as inventory
    const inventory = await prisma.donationItem.groupBy({
      by: ["category", "type", "season", "size", "condition"],
      where: {
        donation: { ngoId: ngo.id, status: { in: ["RECEIVED", "SORTED"] } },
        isDistributed: false,
      },
      _sum: { quantity: true },
      _count: { id: true },
    });

    // Summary totals
    const totals = await prisma.donationItem.aggregate({
      where: {
        donation: { ngoId: ngo.id, status: { in: ["RECEIVED", "SORTED"] } },
        isDistributed: false,
      },
      _sum: { quantity: true },
      _count: { id: true },
    });

    // Category breakdown
    const byCategory = await prisma.donationItem.groupBy({
      by: ["category"],
      where: {
        donation: { ngoId: ngo.id, status: { in: ["RECEIVED", "SORTED"] } },
        isDistributed: false,
      },
      _sum: { quantity: true },
    });

    // Season breakdown
    const bySeason = await prisma.donationItem.groupBy({
      by: ["season"],
      where: {
        donation: { ngoId: ngo.id, status: { in: ["RECEIVED", "SORTED"] } },
        isDistributed: false,
      },
      _sum: { quantity: true },
    });

    return NextResponse.json({
      inventory,
      totals: {
        totalItems: totals._sum.quantity || 0,
        uniqueTypes: totals._count.id || 0,
      },
      byCategory,
      bySeason,
    });
  } catch (error) {
    console.error("Inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
