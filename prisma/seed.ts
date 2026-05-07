import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NekiBridge database...\n");

  // ─── ADMIN USER ────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nekibridge.pk" },
    update: {},
    create: {
      name: "NekiBridge Admin",
      email: "admin@nekibridge.pk",
      passwordHash: adminPassword,
      role: "PLATFORM_ADMIN",
      isActive: true,
      emailVerified: true,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── DONOR USERS ────────────────────────────────
  const donorPassword = await bcrypt.hash("Donor@123", 12);
  const donors = [];

  const donorData = [
    { name: "Ahmed Raza", email: "ahmed@test.com", phone: "+92 300 1234567", city: "Lahore", address: "DHA Phase 5, Lahore" },
    { name: "Fatima Zahra", email: "fatima@test.com", phone: "+92 321 9876543", city: "Islamabad", address: "F-7 Markaz, Islamabad" },
    { name: "Hassan Ali", email: "hassan@test.com", phone: "+92 333 5556677", city: "Karachi", address: "Clifton Block 2, Karachi" },
    { name: "Ayesha Khan", email: "ayesha@test.com", phone: "+92 312 1112233", city: "Rawalpindi", address: "Satellite Town, Rawalpindi" },
    { name: "Omar Farooq", email: "omar@test.com", phone: "+92 345 4445566", city: "Faisalabad", address: "Peoples Colony, Faisalabad" },
  ];

  for (const d of donorData) {
    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: {
        name: d.name,
        email: d.email,
        passwordHash: donorPassword,
        phone: d.phone,
        role: "DONOR",
        isActive: true,
        emailVerified: true,
        donorProfile: {
          create: {
            city: d.city,
            address: d.address,
            totalDonations: Math.floor(Math.random() * 15) + 1,
            totalItems: Math.floor(Math.random() * 50) + 5,
            impactScore: Math.round((Math.random() * 40 + 60) * 10) / 10,
          },
        },
      },
    });
    donors.push(user);
  }
  console.log("✅ 5 donor users created");

  // ─── NGO ADMIN USERS + NGOs ─────────────────────
  const ngoPassword = await bcrypt.hash("Ngo@123", 12);

  const ngoData = [
    {
      adminName: "Faisal Edhi", adminEmail: "admin@edhi.org",
      name: "Edhi Foundation", slug: "edhi-foundation",
      description: "Pakistan's largest and most iconic welfare organization, founded by Abdul Sattar Edhi. Operating 300+ centers nationwide providing clothing, shelter, ambulance services, and disaster relief to millions.",
      descriptionUrdu: "پاکستان کا سب سے بڑا فلاحی ادارہ",
      city: "Karachi", address: "Edhi House, Bolton Market, Karachi",
      latitude: 24.8607, longitude: 67.0011,
      website: "https://edhi.org", phone: "+92-21-111-1330", email: "info@edhi.org",
      foundedYear: 1951, registrationNumber: "REG-001-KHI",
      isVerified: true, rating: 4.9, reviewCount: 24, totalReceived: 120, totalDistributed: 85,
      currentNeeds: JSON.stringify({ BLANKET: "HIGH", JACKET: "HIGH", SWEATER: "MEDIUM", SHALWAR_KAMEEZ: "LOW" }),
    },
    {
      adminName: "Dr. Amjad Saqib", adminEmail: "admin@akhuwat.org",
      name: "Akhuwat Clothes Bank", slug: "akhuwat-clothes-bank",
      description: "A dedicated clothing bank initiative by Akhuwat Foundation. Collects, washes, repairs and distributes used clothing through free 'Gift Shops' where the needy can choose items with dignity.",
      descriptionUrdu: "اخوت کپڑے بینک — مفت تحفے کی دکانیں",
      city: "Lahore", address: "19-A, Akhuwat House, Johar Town, Lahore",
      latitude: 31.4697, longitude: 74.2728,
      website: "https://akhuwat.org.pk", phone: "+92-42-35170202", email: "info@akhuwat.org.pk",
      foundedYear: 2001, registrationNumber: "REG-002-LHR",
      isVerified: true, rating: 4.8, reviewCount: 18, totalReceived: 95, totalDistributed: 62,
      currentNeeds: JSON.stringify({ SHALWAR_KAMEEZ: "HIGH", SHOES: "HIGH", SHIRT: "MEDIUM" }),
    },
    {
      adminName: "Hafeez ur Rehman", adminEmail: "admin@alkhidmat.org",
      name: "Al-Khidmat Foundation", slug: "al-khidmat-foundation",
      description: "A nationwide welfare organization running massive winter clothing drives, distributing blankets and warm clothing to communities in KPK, Balochistan, and AJK.",
      descriptionUrdu: "الخدمت فاؤنڈیشن — سردیوں کی مہم",
      city: "Islamabad", address: "G-9 Markaz, Islamabad",
      latitude: 33.7077, longitude: 73.0498,
      website: "https://alkhidmat.org", phone: "+92-51-2890825", email: "info@alkhidmat.org",
      foundedYear: 1990, registrationNumber: "REG-003-ISB",
      isVerified: true, rating: 4.7, reviewCount: 12, totalReceived: 78, totalDistributed: 48,
      currentNeeds: JSON.stringify({ SWEATER: "HIGH", SHAWL: "HIGH", JACKET: "MEDIUM", BLANKET: "CRITICAL" }),
    },
    {
      adminName: "Ramzan Chhipa", adminEmail: "admin@chhipa.org",
      name: "Chhipa Welfare Association", slug: "chhipa-welfare",
      description: "'You Call We Collect' — Chhipa provides free pickup services for clothing donations across Karachi, distributing to the homeless and underprivileged families.",
      descriptionUrdu: "چھیپا ویلفیئر — آپ بلائیں ہم لے جائیں",
      city: "Karachi", address: "A-83, Block 13-D/1, Gulshan-e-Iqbal, Karachi",
      latitude: 24.9215, longitude: 67.0934,
      website: "https://chhipa.org", phone: "+92-21-111-92-1020", email: "info@chhipa.org",
      foundedYear: 2007, registrationNumber: "REG-004-KHI",
      isVerified: true, rating: 4.8, reviewCount: 9, totalReceived: 55, totalDistributed: 35,
      currentNeeds: JSON.stringify({ SHIRT: "MEDIUM", PANTS: "MEDIUM", BLANKET: "HIGH" }),
    },
    {
      adminName: "Maulana Tariq Jameel", adminEmail: "admin@baitussalam.org",
      name: "Baitussalam Welfare Trust", slug: "baitussalam-welfare",
      description: "Operates a Clothing Bank with donation boxes in major cities. Sorts usable clothing for distribution and recycles unusable textiles to fund education programs.",
      descriptionUrdu: "بیت السلام — کپڑے بینک",
      city: "Lahore", address: "Model Town, Lahore",
      latitude: 31.4828, longitude: 74.3151,
      website: "https://baitussalam.org", phone: "+92-42-35940090", email: "info@baitussalam.org",
      foundedYear: 2003, registrationNumber: "REG-005-LHR",
      isVerified: true, rating: 4.6, reviewCount: 7, totalReceived: 40, totalDistributed: 28,
      currentNeeds: JSON.stringify({ DUPATTA: "MEDIUM", SHALWAR_KAMEEZ: "HIGH" }),
    },
    {
      adminName: "Zafar Abbas", adminEmail: "admin@jdc.org",
      name: "JDC Foundation", slug: "jdc-foundation",
      description: "Known for 'Bazaar-e-Mehrbani' (Market of Kindness) — free markets where families in need can select clothing and household items with dignity and respect.",
      descriptionUrdu: "جے ڈی سی — بازار مہربانی",
      city: "Karachi", address: "Nursery, Shahrah-e-Faisal, Karachi",
      latitude: 24.8682, longitude: 67.0578,
      website: "https://jdcwelfare.org", phone: "+92-21-34526737", email: "info@jdcwelfare.org",
      foundedYear: 2009, registrationNumber: "REG-006-KHI",
      isVerified: true, rating: 4.5, reviewCount: 6, totalReceived: 32, totalDistributed: 22,
      currentNeeds: JSON.stringify({ SHIRT: "LOW", SHOES: "HIGH", BLANKET: "MEDIUM" }),
    },
    {
      adminName: "Saeed Ahmed", adminEmail: "admin@shauoor.org",
      name: "Shauoor Welfare Foundation", slug: "shauoor-welfare",
      description: "Runs a dedicated 'Cloth Bank' program distributing clothing, blankets, and household goods year-round, with special campaigns during winter and Eid.",
      descriptionUrdu: "شعور فاؤنڈیشن — کپڑے بینک",
      city: "Karachi", address: "North Nazimabad, Karachi",
      latitude: 24.9425, longitude: 67.0353,
      website: "https://shauoor.org.pk", phone: "+92-21-36635600", email: "info@shauoor.org.pk",
      foundedYear: 2012, registrationNumber: "REG-007-KHI",
      isVerified: true, rating: 4.4, reviewCount: 5, totalReceived: 25, totalDistributed: 18,
      currentNeeds: JSON.stringify({ SHALWAR_KAMEEZ: "MEDIUM", SHAWL: "HIGH" }),
    },
    {
      adminName: "Noor ul Haq", adminEmail: "admin@tars.org",
      name: "TARS Foundation", slug: "tars-foundation",
      description: "Focused on distributing winter packages including blankets, jackets, and sweaters to homeless individuals and families in Peshawar and surrounding areas.",
      descriptionUrdu: "ٹارز فاؤنڈیشن — سردیوں کے پیکیج",
      city: "Peshawar", address: "University Road, Peshawar",
      latitude: 34.0123, longitude: 71.5785,
      website: "https://tarsfoundation.org.pk", phone: "+92-91-5842200", email: "info@tarsfoundation.org.pk",
      foundedYear: 2015, registrationNumber: "REG-008-PSH",
      isVerified: true, rating: 4.3, reviewCount: 4, totalReceived: 20, totalDistributed: 14,
      currentNeeds: JSON.stringify({ JACKET: "CRITICAL", BLANKET: "CRITICAL", SWEATER: "HIGH" }),
    },
    {
      adminName: "Saylani Admin", adminEmail: "admin@saylani.org",
      name: "Saylani Welfare Trust", slug: "saylani-welfare",
      description: "One of Pakistan's most active welfare trusts providing food, healthcare, education, and seasonal clothing distribution to millions across the country.",
      descriptionUrdu: "سیلانی ویلفیئر ٹرسٹ",
      city: "Karachi", address: "Bahadurabad, Karachi",
      latitude: 24.8918, longitude: 67.0645,
      website: "https://saylani.org", phone: "+92-21-111-729-526", email: "info@saylani.org",
      foundedYear: 1999, registrationNumber: "REG-009-KHI",
      isVerified: true, rating: 4.7, reviewCount: 15, totalReceived: 85, totalDistributed: 58,
      currentNeeds: JSON.stringify({ SHIRT: "MEDIUM", PANTS: "MEDIUM", SHOES: "HIGH" }),
    },
    {
      adminName: "Alamgir Admin", adminEmail: "admin@alamgir.org",
      name: "Alamgir Welfare Trust", slug: "alamgir-welfare",
      description: "Providing general welfare services including clothing for orphans and underprivileged children across multiple cities in Pakistan.",
      descriptionUrdu: "عالمگیر ویلفیئر ٹرسٹ",
      city: "Karachi", address: "Gulshan-e-Iqbal, Karachi",
      latitude: 24.9256, longitude: 67.0867,
      website: "https://alamgirwelfaretrust.org", phone: "+92-21-34963010", email: "info@alamgirwelfaretrust.org",
      foundedYear: 1992, registrationNumber: "REG-010-KHI",
      isVerified: true, rating: 4.5, reviewCount: 5, totalReceived: 28, totalDistributed: 20,
      currentNeeds: JSON.stringify({ SHALWAR_KAMEEZ: "HIGH", SHOES: "MEDIUM" }),
    },
    {
      adminName: "Zammurad Khan", adminEmail: "admin@sweethome.org",
      name: "Pakistan Sweet Homes", slug: "pakistan-sweet-homes",
      description: "An orphanage system across Pakistan providing shelter, education, and care. Always in need of children's clothing in all seasons.",
      descriptionUrdu: "پاکستان سویٹ ہومز — یتیم خانے",
      city: "Islamabad", address: "G-8, Islamabad",
      latitude: 33.6938, longitude: 73.0479,
      website: "https://pakistansweethome.org.pk", phone: "+92-51-2261026", email: "info@psh.org.pk",
      foundedYear: 2009, registrationNumber: "REG-011-ISB",
      isVerified: true, rating: 4.6, reviewCount: 8, totalReceived: 45, totalDistributed: 30,
      currentNeeds: JSON.stringify({ SHIRT: "HIGH", PANTS: "HIGH", SHOES: "CRITICAL", JACKET: "MEDIUM" }),
    },
    {
      adminName: "Mustafa Admin", adminEmail: "admin@almustafa.org",
      name: "Al-Mustafa Welfare Trust", slug: "al-mustafa-welfare",
      description: "An international humanitarian organization based in Lahore, conducting seasonal clothing distribution and welfare programs globally.",
      descriptionUrdu: "المصطفیٰ ویلفیئر ٹرسٹ",
      city: "Lahore", address: "Model Town Link Road, Lahore",
      latitude: 31.4800, longitude: 74.3200,
      website: "https://almustafatrust.org", phone: "+92-42-35452886", email: "info@almustafatrust.org",
      foundedYear: 2008, registrationNumber: "REG-012-LHR",
      isVerified: true, rating: 4.4, reviewCount: 4, totalReceived: 22, totalDistributed: 15,
      currentNeeds: JSON.stringify({ BLANKET: "MEDIUM", SWEATER: "LOW" }),
    },
    {
      adminName: "Rizq Admin", adminEmail: "admin@rizq.com",
      name: "Rizq Trust", slug: "rizq-trust",
      description: "Primarily food-focused but runs seasonal clothing drives during winter and Ramadan, distributing warm clothing to daily wage workers.",
      descriptionUrdu: "رزق ٹرسٹ — موسمی کپڑے",
      city: "Lahore", address: "Gulberg III, Lahore",
      latitude: 31.5200, longitude: 74.3500,
      website: "https://rizq.com.pk", phone: "+92-42-35761000", email: "info@rizq.com.pk",
      foundedYear: 2014, registrationNumber: "REG-013-LHR",
      isVerified: false, rating: 4.2, reviewCount: 3, totalReceived: 12, totalDistributed: 8,
      currentNeeds: JSON.stringify({ JACKET: "MEDIUM", SHAWL: "MEDIUM" }),
    },
    {
      adminName: "Sundas Admin", adminEmail: "admin@sundas.org",
      name: "Sundas Foundation", slug: "sundas-foundation",
      description: "A medical and general welfare foundation in Lahore that accepts clothing donations for patients and their families.",
      descriptionUrdu: "سنداس فاؤنڈیشن",
      city: "Lahore", address: "Faisal Town, Lahore",
      latitude: 31.4750, longitude: 74.2900,
      website: "https://sundasfoundation.com", phone: "+92-42-35160256", email: "info@sundasfoundation.com",
      foundedYear: 1998, registrationNumber: "REG-014-LHR",
      isVerified: false, rating: 4.1, reviewCount: 2, totalReceived: 8, totalDistributed: 5,
      currentNeeds: JSON.stringify({ SHALWAR_KAMEEZ: "LOW", DUPATTA: "LOW" }),
    },
    {
      adminName: "Kashf Admin", adminEmail: "admin@kashf.org",
      name: "Kashf Foundation", slug: "kashf-foundation",
      description: "A women's empowerment organization that accepts women's and children's clothing donations for distribution among underprivileged families.",
      descriptionUrdu: "کشف فاؤنڈیشن — خواتین کی بہتری",
      city: "Lahore", address: "Main Boulevard, Gulberg, Lahore",
      latitude: 31.5100, longitude: 74.3400,
      website: "https://kashf.org", phone: "+92-42-35772015", email: "info@kashf.org",
      foundedYear: 1996, registrationNumber: "REG-015-LHR",
      isVerified: false, rating: 4.0, reviewCount: 1, totalReceived: 6, totalDistributed: 4,
      currentNeeds: JSON.stringify({ DUPATTA: "HIGH", SHALWAR_KAMEEZ: "MEDIUM", SHOES: "LOW" }),
    },
  ];

  const ngoRecords = [];
  for (const n of ngoData) {
    const user = await prisma.user.upsert({
      where: { email: n.adminEmail },
      update: {},
      create: {
        name: n.adminName,
        email: n.adminEmail,
        passwordHash: ngoPassword,
        role: "NGO_ADMIN",
        isActive: true,
        emailVerified: true,
        ngoAdmin: {
          create: {
            name: n.name,
            slug: n.slug,
            description: n.description,
            descriptionUrdu: n.descriptionUrdu,
            city: n.city,
            address: n.address,
            latitude: n.latitude,
            longitude: n.longitude,
            website: n.website,
            phone: n.phone,
            email: n.email,
            foundedYear: n.foundedYear,
            registrationNumber: n.registrationNumber,
            isVerified: n.isVerified,
            verifiedAt: n.isVerified ? new Date() : null,
            rating: n.rating,
            reviewCount: n.reviewCount,
            totalReceived: n.totalReceived,
            totalDistributed: n.totalDistributed,
            currentNeeds: n.currentNeeds,
          },
        },
      },
    });
    const ngo = await prisma.nGO.findFirst({ where: { adminId: user.id } });
    if (ngo) ngoRecords.push(ngo);
  }
  console.log(`✅ ${ngoRecords.length} NGOs created`);

  // ─── SAMPLE DONATIONS ──────────────────────────
  const statuses = ["PENDING", "SCHEDULED", "PICKED_UP", "IN_TRANSIT", "RECEIVED", "SORTED", "DISTRIBUTED"];
  const categories = ["MENS", "WOMENS", "KIDS_BOYS", "KIDS_GIRLS", "UNISEX"];
  const types = ["SHIRT", "PANTS", "SHALWAR_KAMEEZ", "JACKET", "SWEATER", "BLANKET", "SHOES"];
  const seasons = ["SUMMER", "WINTER", "ALL_SEASON"];
  const conditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR"];
  const sizes = ["S", "M", "L", "XL", "FREE_SIZE"];

  let donationCount = 0;
  for (let i = 0; i < 15; i++) {
    const donor = donors[i % donors.length];
    const ngo = ngoRecords[i % ngoRecords.length];
    if (!ngo) continue;

    const status = statuses[Math.min(i % statuses.length, statuses.length - 1)];
    const trackingCode = `NB-2025-${String(i + 1).padStart(5, "0")}`;
    const itemCount = Math.floor(Math.random() * 4) + 1;

    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        ngoId: ngo.id,
        status,
        pickupMethod: i % 3 === 0 ? "NGO_PICKUP" : i % 3 === 1 ? "COURIER" : "DONOR_DROPOFF",
        scheduledDate: new Date(Date.now() + (i - 7) * 86400000),
        scheduledTimeSlot: i % 2 === 0 ? "10:00 AM - 12:00 PM" : "2:00 PM - 4:00 PM",
        trackingCode,
        totalItems: itemCount,
        notes: i % 3 === 0 ? "Please handle with care, freshly washed" : undefined,
        completedAt: status === "DISTRIBUTED" ? new Date() : undefined,
        items: {
          create: Array.from({ length: itemCount }, (_, j) => ({
            category: categories[(i + j) % categories.length],
            type: types[(i + j) % types.length],
            season: seasons[(i + j) % seasons.length],
            condition: conditions[(i + j) % conditions.length],
            size: sizes[(i + j) % sizes.length],
            quantity: Math.floor(Math.random() * 3) + 1,
            isDistributed: status === "DISTRIBUTED",
            distributedAt: status === "DISTRIBUTED" ? new Date() : undefined,
          })),
        },
      },
    });

    // Create status history
    const statusIndex = statuses.indexOf(status);
    for (let s = 0; s <= statusIndex; s++) {
      await prisma.statusUpdate.create({
        data: {
          donationId: donation.id,
          fromStatus: s === 0 ? "PENDING" : statuses[s - 1],
          toStatus: statuses[s],
          note: s === 0 ? "Donation submitted" : `Status updated to ${statuses[s]}`,
          updatedById: s <= 1 ? donor.id : ngo.adminId,
          createdAt: new Date(Date.now() - (statusIndex - s) * 86400000),
        },
      });
    }

    donationCount++;
  }
  console.log(`✅ ${donationCount} sample donations created`);

  // ─── CAMPAIGNS ─────────────────────────────────
  const campaignData = [
    {
      ngoId: ngoRecords[0]?.id,
      title: "Winter Relief Drive 2025",
      titleUrdu: "سردیوں کی امداد مہم ۲۰۲۵",
      description: "Help us provide warm clothing and blankets to 5,000 families across Pakistan this winter. Every donation makes a difference in someone's survival during the harsh cold months.",
      targetItems: 5000, collectedItems: 3200,
      startDate: new Date("2025-11-01"), endDate: new Date("2025-02-28"),
      city: "Nationwide", urgencyLevel: "CRITICAL",
      clothingNeeds: JSON.stringify(["Blankets", "Sweaters", "Shawls", "Jackets"]),
    },
    {
      ngoId: ngoRecords[1]?.id,
      title: "Eid Clothing for Orphans",
      titleUrdu: "یتیموں کے لیے عید کے کپڑے",
      description: "Every child deserves to celebrate Eid in new clothes. Help us provide festive clothing to 2,000 orphans across Lahore and surrounding areas.",
      targetItems: 2000, collectedItems: 800,
      startDate: new Date("2025-02-01"), endDate: new Date("2025-03-28"),
      city: "Lahore", urgencyLevel: "HIGH",
      clothingNeeds: JSON.stringify(["Shalwar Kameez", "Shoes", "Dupattas"]),
    },
    {
      ngoId: ngoRecords[2]?.id,
      title: "School Uniform Drive",
      titleUrdu: "سکول یونیفارم مہم",
      description: "Many children in KPK skip school because they lack proper uniforms. Help us provide school uniforms to 1,500 students.",
      targetItems: 1500, collectedItems: 600,
      startDate: new Date("2025-01-15"), endDate: new Date("2025-04-15"),
      city: "Peshawar", urgencyLevel: "MEDIUM",
      clothingNeeds: JSON.stringify(["School Uniforms", "Shoes", "Socks"]),
    },
    {
      ngoId: ngoRecords[3]?.id,
      title: "Flood Relief Clothing",
      titleUrdu: "سیلاب متاثرین کے لیے کپڑے",
      description: "Emergency clothing drive for families affected by recent flooding in Sindh. Urgent need for all types of clothing.",
      targetItems: 3000, collectedItems: 1200,
      startDate: new Date("2025-01-01"), endDate: new Date("2025-03-01"),
      city: "Karachi", urgencyLevel: "CRITICAL",
      clothingNeeds: JSON.stringify(["All Clothing Types", "Blankets", "Shoes"]),
    },
  ];

  for (const c of campaignData) {
    if (!c.ngoId) continue;
    await prisma.campaign.create({ data: { ...c, ngoId: c.ngoId } });
  }
  console.log("✅ 4 campaigns created");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login credentials:");
  console.log("   Admin:  admin@nekibridge.pk / Admin@123");
  console.log("   Donor:  ahmed@test.com / Donor@123");
  console.log("   NGO:    admin@edhi.org / Ngo@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
