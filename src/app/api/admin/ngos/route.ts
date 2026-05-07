import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "PLATFORM_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const verified = searchParams.get("verified");

    const where: Record<string, unknown> = {};
    if (verified === "true") where.isVerified = true;
    if (verified === "false") where.isVerified = false;

    const [ngos, total] = await Promise.all([
      prisma.nGO.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { name: true, email: true } } },
      }),
      prisma.nGO.count({ where }),
    ]);

    return NextResponse.json({ ngos, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("Admin NGOs error:", error);
    return NextResponse.json({ error: "Failed to fetch NGOs" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "PLATFORM_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ngoId, isVerified } = await request.json();

    const updated = await prisma.nGO.update({
      where: { id: ngoId },
      data: {
        isVerified,
        ...(isVerified ? { verifiedAt: new Date() } : { verifiedAt: null }),
      },
    });

    return NextResponse.json({ message: `NGO ${isVerified ? "verified" : "unverified"}`, ngo: updated });
  } catch (error) {
    console.error("Admin verify NGO error:", error);
    return NextResponse.json({ error: "Failed to update NGO" }, { status: 500 });
  }
}
