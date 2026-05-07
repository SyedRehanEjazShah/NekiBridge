import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { donorRegisterSchema, ngoRegisterSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    if (role === "DONOR") {
      const parsed = donorRegisterSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0].message },
          { status: 400 }
        );
      }

      const { name, email, password, phone, city, address } = parsed.data;

      // Check if user already exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          phone,
          role: "DONOR",
          isActive: true,
          emailVerified: true, // Skip email verification for demo
          donorProfile: {
            create: {
              city,
              address,
            },
          },
        },
      });

      return NextResponse.json(
        { message: "Account created successfully", userId: user.id },
        { status: 201 }
      );
    }

    if (role === "NGO_ADMIN") {
      const parsed = ngoRegisterSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0].message },
          { status: 400 }
        );
      }

      const data = parsed.data;

      // Check if admin email already exists
      const existing = await prisma.user.findUnique({
        where: { email: data.adminEmail },
      });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      // Check if NGO name/slug already exists
      const slug = slugify(data.ngoName);
      const existingNGO = await prisma.nGO.findUnique({ where: { slug } });
      if (existingNGO) {
        return NextResponse.json(
          { error: "An NGO with this name already exists" },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(data.adminPassword, 12);

      const user = await prisma.user.create({
        data: {
          name: data.adminName,
          email: data.adminEmail,
          passwordHash,
          phone: data.adminPhone,
          role: "NGO_ADMIN",
          isActive: true,
          emailVerified: true,
          ngoAdmin: {
            create: {
              name: data.ngoName,
              slug,
              description: data.description,
              registrationNumber: data.registrationNumber,
              website: data.website || null,
              phone: data.phone,
              email: data.email || null,
              foundedYear: data.foundedYear,
              city: data.city,
              address: data.address,
              isVerified: false, // Needs admin verification
            },
          },
        },
      });

      return NextResponse.json(
        { message: "NGO registered successfully. Pending verification.", userId: user.id },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
