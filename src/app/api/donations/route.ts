import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createDonationSchema } from "@/lib/validators";
import { generateTrackingCode } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = { donorId: session.user.id };
    if (status && status !== "all") {
      where.status = status;
    }

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          ngo: { select: { name: true, slug: true, city: true, logo: true } },
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
    console.error("Donations list error:", error);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "DONOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createDonationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const data = parsed.data;

    // Verify NGO exists
    const ngo = await prisma.nGO.findUnique({ where: { id: data.ngoId } });
    if (!ngo) {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 });
    }

    const trackingCode = generateTrackingCode();
    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);

    const donation = await prisma.$transaction(async (tx) => {
      const d = await tx.donation.create({
        data: {
          donorId: session.user.id,
          ngoId: data.ngoId,
          status: "PENDING",
          pickupMethod: data.pickupMethod,
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
          scheduledTimeSlot: data.scheduledTimeSlot,
          pickupAddress: data.pickupAddress,
          trackingCode,
          totalItems,
          notes: data.notes,
          items: {
            create: data.items.map((item) => ({
              category: item.category,
              type: item.type,
              season: item.season,
              condition: item.condition,
              size: item.size,
              quantity: item.quantity,
              description: item.description,
            })),
          },
          statusHistory: {
            create: {
              fromStatus: "PENDING",
              toStatus: "PENDING",
              note: "Donation submitted",
              updatedById: session.user.id,
            },
          },
        },
        include: {
          items: true,
          ngo: { select: { name: true } },
        },
      });

      // Update donor profile stats
      await tx.donorProfile.updateMany({
        where: { userId: session.user.id },
        data: {
          totalDonations: { increment: 1 },
          totalItems: { increment: totalItems },
        },
      });

      // Update NGO stats
      await tx.nGO.update({
        where: { id: data.ngoId },
        data: { totalReceived: { increment: totalItems } },
      });

      return d;
    });

    return NextResponse.json(
      { message: "Donation created successfully", donation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create donation error:", error);
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 });
  }
}
