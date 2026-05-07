import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const ngo = await prisma.nGO.findUnique({
      where: { slug },
      include: {
        campaigns: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        reviews: {
          include: {
            donor: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { donations: true, campaigns: true },
        },
      },
    });

    if (!ngo) {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 });
    }

    return NextResponse.json(ngo);
  } catch (error) {
    console.error("NGO detail error:", error);
    return NextResponse.json({ error: "Failed to fetch NGO" }, { status: 500 });
  }
}
