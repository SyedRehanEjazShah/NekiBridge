# 🎯 NekiBridge — Smart Clothing Donation & Distribution Platform

## Enterprise-Level Full-Stack Development Prompt

---

## Part 1: Pakistani NGOs Research (Clothing Donation & Distribution)

Below is the comprehensive list of verified NGOs in Pakistan that accept and distribute clothing donations. This data will be **seeded into the platform's database** as partner NGOs.

### Tier 1 — National-Scale Organizations

| # | NGO Name | City/HQ | Services | Website |
|---|----------|---------|----------|---------|
| 1 | **Edhi Foundation** | Karachi (nationwide) | Clothing, shelter, ambulance, disaster relief | edhi.org |
| 2 | **Akhuwat Foundation (Clothes Bank)** | Lahore (nationwide) | Dedicated clothing bank, "Gift Shops" for free selection, washing & repair | akhuwat.org.pk |
| 3 | **Al-Khidmat Foundation** | Islamabad (nationwide) | Winter clothing drives, blankets, disaster relief clothing | alkhidmat.org |
| 4 | **Saylani Welfare International Trust** | Karachi (nationwide) | Food, clothing, education, healthcare | saylani.org |
| 5 | **Chhipa Welfare Association** | Karachi (nationwide) | "You Call We Collect" service, clothing, food, shelter | chhipa.org |
| 6 | **Baitussalam Welfare Trust** | Lahore (nationwide) | Clothing Bank with drop-off boxes in Karachi, Lahore, Islamabad; textile recycling | baitussalam.org |

### Tier 2 — Regional & Specialized Organizations

| # | NGO Name | City/HQ | Services | Website |
|---|----------|---------|----------|---------|
| 7 | **JDC Foundation** | Karachi | "Bazaar-e-Mehrbani" (free market for needy), emergency clothing | jdcwelfare.org |
| 8 | **Shauoor Welfare Foundation** | Karachi | "Cloth Bank" program, winter & Eid campaigns | shauoor.org.pk |
| 9 | **TARS Foundation** | Peshawar | Winter packages (blankets, jackets, sweaters) for homeless | tarsfoundation.org.pk |
| 10 | **Alamgir Welfare Trust** | Karachi (multi-city) | General welfare including clothing for orphans | alamgirwelfaretrust.org |
| 11 | **Pakistan Sweet Homes** | Islamabad | Orphanage system — children's clothing needs | pakistansweethome.org.pk |
| 12 | **Al-Mustafa Welfare Trust** | Lahore (international) | Global humanitarian, seasonal clothing distribution | almustafatrust.org |
| 13 | **Rizq Trust** | Lahore | Food-focused but runs seasonal clothing drives | rizq.com.pk |
| 14 | **Sundas Foundation** | Lahore | Medical + general welfare, accepts clothing | sundasfoundation.com |
| 15 | **Kashf Foundation** | Lahore | Women empowerment, accepts women's/children's clothing | kashf.org |

---

## Part 2: The Enterprise-Level Prompt

> **Copy everything below this line and paste it into any capable LLM (Claude, GPT-4, Gemini) to generate the full application.**

---

````
# SYSTEM PROMPT — ENTERPRISE FULL-STACK WEB APPLICATION

You are a Principal Full-Stack Software Engineer with 15+ years of experience building 
enterprise SaaS platforms. You write production-grade, scalable, maintainable code — 
NOT prototypes, NOT vibe-coded demos. Every file you produce must be deployment-ready.

---

## PROJECT: NekiBridge — Smart Clothing Donation & Distribution Platform (Pakistan)

### 1. BUSINESS CONTEXT

In Pakistan, clothing donation is broken:
- Donors dump clothes randomly — no tracking, no feedback
- NGOs receive mountains of unusable/unsorted clothing
- Needy people don't get the right size, season, or type
- Zero digital infrastructure connects donors → NGOs → beneficiaries

**NekiBridge** solves this by being the middleware platform that:
1. Lets DONORS register, browse verified NGOs, and schedule clothing pickups/drop-offs
2. Lets NGOs manage incoming donations, track inventory, and report distribution
3. Uses SMART MATCHING to suggest which NGO needs what type/size/season of clothing
4. Provides full DONATION TRACKING from donor → NGO → beneficiary
5. Generates IMPACT REPORTS so donors see exactly where their clothes went

### 2. TECH STACK (Non-Negotiable)

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | **Next.js 15 (App Router)** | SSR + API routes in one codebase |
| Language | **TypeScript** (strict mode) | Type safety across full stack |
| Database | **PostgreSQL 16** | Relational data with JSONB flexibility |
| ORM | **Prisma 6** | Type-safe queries, migrations, seeding |
| Auth | **NextAuth.js v5 (Auth.js)** | Credentials + Google OAuth |
| State | **Zustand** | Lightweight client state management |
| Forms | **React Hook Form + Zod** | Validated forms with schema inference |
| Styling | **Tailwind CSS v4 + shadcn/ui** | Utility-first + accessible component primitives |
| File Upload | **UploadThing** or **Cloudinary** | Clothing image uploads |
| Email | **Resend** | Transactional emails (verification, receipts) |
| Charts | **Recharts** | Dashboard analytics and impact visualization |
| Maps | **Leaflet.js** or **Google Maps API** | NGO location mapping & pickup scheduling |
| Deployment | **Vercel** (frontend) + **Supabase/Neon** (DB) | Serverless-optimized |
| Testing | **Vitest + Playwright** | Unit + E2E testing |

### 3. DATABASE SCHEMA (Prisma)

Design these models with proper relations, indexes, enums, and timestamps:

```prisma
// === ENUMS ===
enum UserRole { DONOR, NGO_ADMIN, PLATFORM_ADMIN }
enum DonationStatus { PENDING, SCHEDULED, PICKED_UP, IN_TRANSIT, RECEIVED, SORTED, DISTRIBUTED, REJECTED }
enum ClothingCategory { MENS, WOMENS, KIDS_BOYS, KIDS_GIRLS, INFANT, UNISEX }
enum ClothingType { SHIRT, PANTS, DRESS, SHALWAR_KAMEEZ, DUPATTA, JACKET, SWEATER, SHAWL, BLANKET, SHOES, UNDERGARMENTS, OTHER }
enum ClothingSeason { SUMMER, WINTER, ALL_SEASON }
enum ClothingCondition { NEW, LIKE_NEW, GOOD, FAIR }
enum ClothingSize { XS, S, M, L, XL, XXL, FREE_SIZE }
enum PickupMethod { DONOR_DROPOFF, NGO_PICKUP, COURIER }

// === MODELS ===
model User {
  id, email, passwordHash, name, phone, role, avatar,
  emailVerified, isActive, createdAt, updatedAt
  // Relations: profile, donations, reviews
}

model DonorProfile {
  userId, cnic (optional, encrypted), city, address, coordinates (lat/lng),
  totalDonations, totalItems, impactScore, preferredNGOs[], badges[]
}

model NGO {
  id, name, slug, description, logo, coverImage, registrationNumber,
  foundedYear, website, phone, email, isVerified, verifiedAt,
  // Location
  city, address, coordinates,
  // Capacity & Needs
  currentNeeds (JSONB — what types/sizes/seasons they currently need),
  operatingHours, acceptsPickup, pickupRadius (km),
  // Stats
  totalReceived, totalDistributed, rating, reviewCount,
  // Relations: donations, campaigns, team members, reviews
}

model Donation {
  id, donorId, ngoId, status, pickupMethod,
  // Scheduling
  scheduledDate, scheduledTimeSlot, pickupAddress, pickupCoordinates,
  // Content
  items: DonationItem[],
  totalItems, notes, images[],
  // Tracking
  trackingCode (unique, auto-generated like "NB-2025-XXXXX"),
  statusHistory: StatusUpdate[],
  // Feedback
  donorRating, donorFeedback, ngoNotes,
  createdAt, updatedAt, completedAt
}

model DonationItem {
  id, donationId, category, type, season, condition, size,
  quantity, description, imageUrl,
  // Distribution tracking
  isDistributed, distributedAt, beneficiaryNote
}

model Campaign {
  id, ngoId, title, description, coverImage,
  targetItems, collectedItems, startDate, endDate, isActive,
  clothingNeeds (JSONB — specific types/sizes needed),
  city, urgencyLevel (LOW, MEDIUM, HIGH, CRITICAL)
}

model Review {
  id, donorId, ngoId, donationId, rating (1-5), comment, createdAt
}

model Notification {
  id, userId, title, message, type, isRead, actionUrl, createdAt
}

model StatusUpdate {
  id, donationId, fromStatus, toStatus, note, updatedBy, createdAt
}
```

### 4. APPLICATION ARCHITECTURE

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group
│   │   ├── login/
│   │   ├── register/
│   │   │   ├── donor/            # Donor registration
│   │   │   └── ngo/              # NGO registration (with verification docs)
│   │   ├── verify-email/
│   │   └── forgot-password/
│   ├── (platform)/               # Authenticated routes
│   │   ├── dashboard/            # Role-based dashboard redirect
│   │   ├── donor/
│   │   │   ├── dashboard/        # Donor stats, recent donations, impact
│   │   │   ├── donate/           # New donation flow (multi-step form)
│   │   │   ├── my-donations/     # Donation history + tracking
│   │   │   ├── ngos/             # Browse & search NGOs
│   │   │   ├── ngos/[slug]/      # NGO detail page
│   │   │   ├── campaigns/        # Active campaigns from NGOs
│   │   │   ├── impact/           # Personal impact report
│   │   │   └── settings/         # Profile, preferences, notifications
│   │   ├── ngo/
│   │   │   ├── dashboard/        # NGO stats, incoming donations, needs
│   │   │   ├── donations/        # Manage incoming donations
│   │   │   ├── donations/[id]/   # Donation detail + status update
│   │   │   ├── inventory/        # Current clothing inventory
│   │   │   ├── campaigns/        # Create/manage campaigns
│   │   │   ├── distribution/     # Log distribution to beneficiaries
│   │   │   └── settings/         # NGO profile, team, operating hours
│   │   └── admin/
│   │       ├── dashboard/        # Platform-wide analytics
│   │       ├── ngos/             # Verify/manage NGOs
│   │       ├── users/            # User management
│   │       ├── donations/        # All donations oversight
│   │       └── reports/          # Generate reports
│   ├── (marketing)/              # Public pages
│   │   ├── page.tsx              # Landing page (hero, how it works, stats, CTA)
│   │   ├── about/
│   │   ├── how-it-works/
│   │   ├── ngos/                 # Public NGO directory
│   │   └── contact/
│   └── api/                      # API routes
│       ├── auth/[...nextauth]/
│       ├── donations/
│       ├── ngos/
│       ├── campaigns/
│       ├── upload/
│       ├── notifications/
│       └── admin/
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Navbar, Sidebar, Footer
│   ├── forms/                    # DonationForm, RegisterForm, etc.
│   ├── cards/                    # NGOCard, DonationCard, CampaignCard
│   ├── dashboard/                # StatCard, Charts, RecentActivity
│   ├── tracking/                 # DonationTracker, StatusTimeline
│   └── shared/                   # SearchBar, Filters, Pagination, EmptyState
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth config
│   ├── validators/               # Zod schemas
│   ├── utils/                    # Helpers (formatDate, generateTrackingCode, etc.)
│   ├── constants/                # Pakistan cities, clothing categories, etc.
│   └── matching/                 # Smart matching algorithm
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript type definitions
└── prisma/
    ├── schema.prisma
    ├── seed.ts                   # Seed 15 Pakistani NGOs + sample data
    └── migrations/
```

### 5. KEY FEATURES — DETAILED SPECIFICATIONS

#### 5A. LANDING PAGE (Public)
- **Hero Section**: Full-width gradient background with floating clothing illustration, 
  animated counter showing "X clothes donated through NekiBridge", prominent CTA buttons 
  "Donate Now" and "Register as NGO"
- **How It Works**: 4-step visual flow (Register → Choose NGO → Schedule → Track)
- **Live Stats Bar**: Animated counters — Total Donations, Active NGOs, Cities Covered, 
  Items Distributed
- **Featured NGOs**: Horizontal scrollable cards of verified NGOs with logos and ratings
- **Active Campaigns**: Urgent needs from NGOs (e.g., "Winter Drive — 500 blankets needed")
- **Testimonials**: Donor stories with avatar, quote, impact stats
- **Footer**: Links, social media, newsletter signup

#### 5B. DONOR REGISTRATION & ONBOARDING
- Multi-step form: Basic Info → Location (city dropdown with Pakistani cities) → 
  Preferences (preferred NGOs, clothing types) → Avatar upload
- Email verification with OTP or magic link
- Post-registration onboarding tour (tooltips highlighting key features)

#### 5C. DONATION FLOW (Multi-Step Wizard)
Step 1: **Select NGO** — Browse NGOs with filters (city, rating, current needs), 
  or get SMART MATCH suggestion based on what you're donating
Step 2: **Add Items** — Dynamic form to add clothing items with category, type, size, 
  season, condition, quantity. Optional photo upload per item.
Step 3: **Pickup Method** — Choose drop-off at NGO center (show map), 
  NGO pickup (schedule date/time, enter address), or courier
Step 4: **Review & Confirm** — Summary of all items, NGO details, pickup info. 
  Generate tracking code on submission.

#### 5D. DONATION TRACKING
- Unique tracking code per donation (format: NB-2025-XXXXX)
- Visual timeline/stepper showing: Pending → Scheduled → Picked Up → In Transit → 
  Received → Sorted → Distributed
- Each status update includes timestamp, note from NGO, and optional photo proof
- Email/SMS notifications on status changes
- Public tracking page (no login required — just enter tracking code)

#### 5E. SMART MATCHING ALGORITHM
```typescript
// Algorithm considers:
// 1. NGO's current needs (what types/sizes/seasons they need most)
// 2. Geographic proximity (prefer closer NGOs to reduce logistics)
// 3. NGO capacity (don't overload small NGOs)
// 4. Season relevance (winter clothes → NGOs running winter drives)
// 5. NGO rating (higher-rated NGOs get slight preference)
// Returns: Ranked list of top 3-5 matching NGOs with match score percentage
```

#### 5F. NGO DASHBOARD
- **Overview Cards**: Total received, pending pickups, inventory count, distribution rate
- **Incoming Donations**: Table with filters, status badges, action buttons (accept/reject)
- **Inventory Management**: Categorized view of current stock by type/size/season
- **Distribution Log**: Record when items are given to beneficiaries (date, count, notes)
- **Campaign Manager**: Create targeted campaigns specifying exact needs
- **Analytics Charts**: Monthly donations received vs distributed, top clothing categories

#### 5G. ADMIN PANEL
- **Platform Analytics**: Total users, donations, NGOs, distribution rate, growth charts
- **NGO Verification**: Review applications, verify documents, approve/reject
- **User Management**: Search, filter, suspend accounts
- **Content Management**: Feature NGOs on homepage, manage campaigns visibility
- **Reports**: Export CSV/PDF of platform-wide donation data

### 6. UI/UX DESIGN SYSTEM

#### Color Palette
```css
/* Primary — Warm Emerald Green (Trust, Growth, Charity) */
--primary-50: #ecfdf5;
--primary-100: #d1fae5;
--primary-500: #10b981;
--primary-600: #059669;
--primary-700: #047857;
--primary-900: #064e3b;

/* Secondary — Warm Amber (Warmth, Generosity) */
--secondary-50: #fffbeb;
--secondary-500: #f59e0b;
--secondary-600: #d97706;

/* Accent — Soft Coral (Urgency for campaigns) */
--accent-500: #f43f5e;
--accent-600: #e11d48;

/* Neutrals — Warm Grays */
--gray-50: #fafaf9;
--gray-100: #f5f5f4;
--gray-800: #292524;
--gray-900: #1c1917;

/* Semantic */
--success: #22c55e;
--warning: #eab308;
--error: #ef4444;
--info: #3b82f6;
```

#### Typography
```css
/* Headings: "Plus Jakarta Sans" — modern, warm, premium */
/* Body: "Inter" — highly readable, professional */
/* Accent/Urdu: "Noto Nastaliq Urdu" — for bilingual support */

--font-heading: 'Plus Jakarta Sans', sans-serif;
--font-body: 'Inter', sans-serif;
--font-urdu: 'Noto Nastaliq Urdu', serif;
```

#### Design Principles
1. **Glassmorphism cards** with subtle backdrop-blur on dashboards
2. **Gradient CTAs**: emerald-to-teal gradients on primary buttons
3. **Micro-animations**: Framer Motion for page transitions, card hovers, number counters
4. **Status badges**: Color-coded pills (pending=amber, active=green, completed=blue)
5. **Dark mode**: Full dark mode support with warm dark neutrals (stone palette)
6. **Responsive**: Mobile-first, breakpoints at sm(640) md(768) lg(1024) xl(1280)
7. **Pakistani cultural touches**: Islamic geometric patterns as subtle background textures, 
   green & white accent colors echoing national identity
8. **Accessibility**: WCAG 2.1 AA compliant, proper ARIA labels, keyboard navigation
9. **Loading states**: Skeleton loaders for all data-fetching components
10. **Empty states**: Illustrated empty states with helpful CTAs

#### Key UI Components to Build
- `<Navbar>` — Sticky, transparent-to-solid on scroll, role-based menu items
- `<Sidebar>` — Collapsible dashboard sidebar with icon + label navigation
- `<StatCard>` — Glassmorphic card with icon, label, value, trend indicator
- `<NGOCard>` — Logo, name, city, rating stars, current needs tags, "Donate" button
- `<DonationCard>` — Tracking code, status badge, items summary, date, NGO name
- `<CampaignBanner>` — Urgency-colored banner with progress bar, CTA
- `<StatusTimeline>` — Vertical stepper with icons, timestamps, status descriptions
- `<DonationWizard>` — Multi-step form with progress bar, validation, review step
- `<FilterBar>` — City, category, season, condition dropdowns with search
- `<ImpactReport>` — Visual report with charts, total items, NGOs helped, timeline

### 7. API ROUTES SPECIFICATION

```
POST   /api/auth/register          — Register (donor or NGO)
POST   /api/auth/login              — Credentials login
GET    /api/auth/session             — Get current session

GET    /api/ngos                     — List NGOs (paginated, filterable)
GET    /api/ngos/[slug]              — NGO detail
GET    /api/ngos/[slug]/needs        — Current needs of an NGO
POST   /api/ngos/[slug]/reviews      — Submit review

POST   /api/donations                — Create new donation
GET    /api/donations                — List donations (role-filtered)
GET    /api/donations/[id]           — Donation detail
PATCH  /api/donations/[id]/status    — Update donation status (NGO only)
GET    /api/donations/track/[code]   — Public tracking endpoint

GET    /api/campaigns                — List active campaigns
POST   /api/campaigns                — Create campaign (NGO only)

GET    /api/matching/suggest         — Smart match NGOs for donation items
GET    /api/dashboard/stats          — Role-based dashboard stats
POST   /api/upload                   — File upload endpoint

GET    /api/admin/analytics          — Platform-wide analytics
PATCH  /api/admin/ngos/[id]/verify   — Verify NGO
```

### 8. SEED DATA

Seed the database with these 15 real Pakistani NGOs (from Part 1 of this document).
For each NGO, generate realistic:
- Descriptions (2-3 sentences about their clothing programs)
- Operating hours, cities, addresses
- Current needs (randomized but seasonally appropriate)
- Ratings (4.0–4.9 range)
- 3-5 sample donations with full tracking history

Also seed:
- 5 sample donor accounts with realistic Pakistani names
- 1 admin account (admin@nekibridge.pk / Admin@123)
- 10-15 sample donations in various statuses
- 3-4 active campaigns

### 9. DEVELOPMENT PHASES

**Phase 1 — Foundation (deliver first)**
- Project setup, database, auth, landing page
- Donor registration & login
- NGO listing page (read-only from seed data)

**Phase 2 — Core Donation Flow**
- Donation wizard (multi-step form)
- Donation tracking with status timeline
- NGO detail pages

**Phase 3 — NGO Dashboard**
- NGO login & dashboard
- Donation management (accept/reject/update status)
- Inventory tracking

**Phase 4 — Intelligence & Admin**
- Smart matching algorithm
- Admin panel with analytics
- Campaign system

**Phase 5 — Polish**
- Impact reports for donors
- Email notifications
- Dark mode, animations, performance optimization
- E2E tests with Playwright

### 10. CODE QUALITY REQUIREMENTS

- **NO** `any` types in TypeScript — everything strictly typed
- **NO** inline styles — all styling through Tailwind classes
- **NO** hardcoded strings — use constants files
- **NO** business logic in components — extract to lib/ or hooks/
- **YES** proper error boundaries and error handling
- **YES** loading and empty states for every data-fetching component
- **YES** input validation on both client (Zod) AND server (Zod)
- **YES** proper HTTP status codes and error response format
- **YES** database indexes on frequently queried columns
- **YES** environment variable validation with Zod on startup
- **YES** proper git-friendly file organization (one component per file)
- **YES** JSDoc comments on all exported functions and complex logic
- **YES** middleware for route protection based on user roles

### 11. ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# File Upload
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Email
RESEND_API_KEY=

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
```

### 12. INSTRUCTIONS FOR THE LLM

1. Start with Phase 1. Deliver COMPLETE, WORKING files — not snippets.
2. Every file must have proper imports, exports, and types.
3. Use Server Components by default; add "use client" only when needed.
4. Implement proper error handling with try-catch and user-friendly error messages.
5. Use Prisma transactions for multi-table operations.
6. Implement optimistic updates where appropriate.
7. Follow Next.js 15 conventions (app router, server actions, metadata API).
8. Generate the prisma schema FIRST, then seed file, then auth, then pages.
9. Make the landing page STUNNING — this is the first impression.
10. Use Framer Motion for all page transitions and micro-interactions.
11. Every interactive element needs hover/focus/active states.
12. Implement proper pagination (cursor-based for donations, offset for NGOs).
13. Use Next.js Image component for all images with proper sizing.
14. Add proper SEO metadata to every page.
15. The donation tracking page must work WITHOUT authentication (public).

BEGIN IMPLEMENTATION WITH PHASE 1.
````

---

## Part 3: How to Use This Prompt

### Option A — Single Session (Best for Claude/GPT with large context)
1. Copy the entire prompt from Part 2
2. Paste into Claude Opus / GPT-4 / Gemini
3. It will generate Phase 1 files
4. Say "Continue with Phase 2" after each phase

### Option B — Phased Approach (Recommended)
1. Use the full prompt as the **system prompt** or initial context
2. Then ask phase-by-phase:
   - *"Implement Phase 1: Project setup, Prisma schema, auth, and landing page"*
   - *"Implement Phase 2: Donation wizard and tracking system"*
   - etc.

### Option C — Use with Antigravity/Cursor/Windsurf
1. Save this prompt as a `.md` file in your project root
2. Reference it as context: *"Follow the specifications in enterprise_prompt.md to build Phase 1"*

> [!TIP]
> For the best results, use **Claude Opus** or **GPT-4** with the full prompt. 
> These models handle the enterprise-level complexity and produce production-quality code.

> [!IMPORTANT]
> Before starting development, make sure you have **Node.js 20+**, **PostgreSQL 16**, 
> and **pnpm** installed. Run `npx create-next-app@latest ./` first to scaffold the project.
