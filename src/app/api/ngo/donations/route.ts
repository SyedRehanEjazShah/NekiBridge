import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "NGO_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ngo = await prisma.nGO.findUnique({ where: { adminId: session.user.id } });
    if (!ngo) return NextResponse.json({ error: "NGO not found" }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = { ngoId: ngo.id };
    if (status && status !== "all") where.status = status;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          donor: { select: { name: true, email: true, phone: true } },
          items: true,
          _count: { select: { items: true, statusHistory: true } },
        },
      }),
      prisma.donation.count({ where }),
    ]);

    return NextResponse.json({
      donations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("NGO donations error:", error);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "NGO_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ngo = await prisma.nGO.findUnique({ where: { adminId: session.user.id } });
    if (!ngo) return NextResponse.json({ error: "NGO not found" }, { status: 404 });

    const { donationId, newStatus, note } = await request.json();

    const donation = await prisma.donation.findFirst({
      where: { id: donationId, ngoId: ngo.id },
    });
    if (!donation) return NextResponse.json({ error: "Donation not found" }, { status: 404 });

    const updated = await prisma.$transaction(async (tx) => {
      const d = await tx.donation.update({
        where: { id: donationId },
        data: {
          status: newStatus,
          completedAt: newStatus === "DISTRIBUTED" ? new Date() : undefined,
        },
      });

      await tx.statusUpdate.create({
        data: {
          donationId,
          fromStatus: donation.status,
          toStatus: newStatus,
          note: note || `Status updated to ${newStatus}`,
          updatedById: session.user.id,
        },
      });

      if (newStatus === "DISTRIBUTED") {
        await tx.donationItem.updateMany({
          where: { donationId },
          data: { isDistributed: true, distributedAt: new Date() },
        });
        await tx.nGO.update({
          where: { id: ngo.id },
          data: { totalDistributed: { increment: donation.totalItems } },
        });
      }

      return d;
    });

    return NextResponse.json({ message: "Status updated", donation: updated });
  } catch (error) {
    console.error("Update donation error:", error);
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 });
  }
}
