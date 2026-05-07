import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const verified = searchParams.get("verified");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (city && city !== "all") {
      where.city = city;
    }

    if (verified === "true") {
      where.isVerified = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const [ngos, total] = await Promise.all([
      prisma.nGO.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isVerified: "desc" }, { rating: "desc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          descriptionUrdu: true,
          logo: true,
          city: true,
          address: true,
          isVerified: true,
          rating: true,
          reviewCount: true,
          totalReceived: true,
          totalDistributed: true,
          currentNeeds: true,
          acceptsPickup: true,
          phone: true,
          website: true,
        },
      }),
      prisma.nGO.count({ where }),
    ]);

    return NextResponse.json({
      ngos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("NGO list error:", error);
    return NextResponse.json({ error: "Failed to fetch NGOs" }, { status: 500 });
  }
}
