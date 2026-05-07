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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where: { ngoId: ngo.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.campaign.count({ where: { ngoId: ngo.id } }),
    ]);

    return NextResponse.json({
      campaigns,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("NGO campaigns error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "NGO_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ngo = await prisma.nGO.findUnique({ where: { adminId: session.user.id } });
    if (!ngo) return NextResponse.json({ error: "NGO not found" }, { status: 404 });

    const body = await request.json();

    const campaign = await prisma.campaign.create({
      data: {
        ngoId: ngo.id,
        title: body.title,
        titleUrdu: body.titleUrdu || null,
        description: body.description,
        targetItems: body.targetItems,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        city: body.city || ngo.city,
        urgencyLevel: body.urgencyLevel || "MEDIUM",
        clothingNeeds: body.clothingNeeds || "{}",
      },
    });

    return NextResponse.json({ message: "Campaign created", campaign }, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
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

    const { campaignId, ...updates } = await request.json();

    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, ngoId: ngo.id },
    });
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

    const updated = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(updates.title && { title: updates.title }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
        ...(updates.urgencyLevel && { urgencyLevel: updates.urgencyLevel }),
      },
    });

    return NextResponse.json({ message: "Campaign updated", campaign: updated });
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}
