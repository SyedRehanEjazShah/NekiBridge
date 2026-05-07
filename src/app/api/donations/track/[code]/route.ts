import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const donation = await prisma.donation.findUnique({
      where: { trackingCode: code },
      include: {
        ngo: {
          select: { name: true, slug: true, city: true, phone: true, logo: true },
        },
        items: {
          select: {
            id: true, category: true, type: true, season: true,
            condition: true, size: true, quantity: true,
            isDistributed: true, distributedAt: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "asc" },
          include: {
            updatedBy: { select: { name: true, role: true } },
          },
        },
      },
    });

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    // Strip sensitive data for public tracking
    const { donorId, pickupLatitude, pickupLongitude, ...publicData } = donation;

    return NextResponse.json(publicData);
  } catch (error) {
    console.error("Track donation error:", error);
    return NextResponse.json({ error: "Failed to track donation" }, { status: 500 });
  }
}
