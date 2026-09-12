# House of Aarovi

> **A luxury ethnic couture and modern bespoke apparel e-commerce platform.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-purple?style=flat-square)](https://better-auth.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](./LICENSE)

---

## ✦ Overview

**House of Aarovi** combines the elegance of bespoke Indian ethnic couture with a modern, high-performance digital commerce experience. Built on Next.js 16, React 19, and Tailwind CSS v4, the platform delivers fluid editorial layouts, interactive custom garment design studios, seamless UPI and payment gateway checkouts, and a comprehensive administrative dashboard.

---

## ✦ Key Features

### 🛍️ Luxury Storefront & Catalog
- **Curated Collections**: Browse designer collections across ethnic wear, bridal couture, and modern occasion wear.
- **Dynamic Filtering & Sorting**: Filter garments by category, sub-category, gender, and price range.
- **Rich Product Views**: High-resolution image galleries, sizing charts, stock availability, and compare-at pricing.

### ✨ Bespoke Customization Studio
- **Interactive Garment Customizer**: Design personalized outfits by selecting garment types, silhouettes, necklines, sleeve cuts, fabrics, and embroidery work.
- **Reference Media Uploads**: Attach reference sketches and inspiration photos directly with automated asset management.
- **Quoting & Status Lifecycle**: Submit design requests for artisan estimation, quote approvals, and real-time production status tracking.

### 💳 Seamless Checkout & Payments
- **UPI QR Payments**: Integrated UPI payment workflow with instant QR presentation and customer transaction proof upload.
- **Payment Verification**: Manual and automated payment verification flows for seamless order fulfillment.
- **Gateway Support**: Extensible payment infrastructure with Razorpay support.

### 🔐 Secure Authentication & User Accounts
- **Better Auth Integration**: High-security authentication supporting email/password credential flows and session tracking.
- **Role-Based Access Control (RBAC)**: Distinct permissions for customers (`USER`) and administrators (`ADMIN`).
- **Profile & Order Center**: Customer address books, order tracking, and bespoke request histories.

### 🛡️ Administration Suite
- **Product Catalog Management**: Create, edit, and safely soft-delete products with instant cache invalidation.
- **Order Processing**: Review order items, customer addresses, payment slips, and transition fulfillment statuses.
- **Customization Request Reviews**: Inspect incoming custom design requests, review uploaded reference media, and issue quotes.
- **System Settings**: Dynamically configure store banners, alerts, and platform operational variables.

### 🎨 Design & Motion Aesthetics
- **Editorial Typography & Visuals**: Typography-driven aesthetic tailored for luxury couture.
- **Smooth Animations**: Powered by [GSAP](https://greensock.com/) and [Framer Motion](https://www.framer.com/motion/).
- **Inertial Scrolling**: Seamless page scrolling powered by [Lenis](https://lenis.darkroom.engineering/).
- **Responsive Architecture**: Pixel-perfect design across mobile, tablet, and ultra-wide displays.

### ⚡ Infrastructure & Communication
- **Hybrid Storage Adapter**: Flexible file storage supporting local filesystem storage or AWS S3 with presigned URLs.
- **Transactional Emails**: Automated order confirmations and notifications powered by [Resend](https://resend.com/) and [React Email](https://react.email/).

---

## ✦ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations & Motion** | GSAP, Framer Motion, Lenis Smooth Scroll |
| **Database & ORM** | PostgreSQL, [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [Better Auth](https://better-auth.com/) (Prisma Adapter, session cookies) |
| **Cloud Storage** | AWS S3 (`@aws-sdk/client-s3`) / Local Public Storage |
| **Emails** | [Resend](https://resend.com/), React Email |
| **Package Manager / Runtime** | [Bun](https://bun.sh/) / Node.js 20+ |

---

## ✦ Project Structure

```text
aarovi/
├── .agents/                 # AI agent rules & workflow configurations
├── LICENSE                  # Proprietary license (Shaik Imaduddin)
├── README.md                # Project documentation
└── web/                     # Next.js web application
    ├── app/                 # Next.js App Router (pages, layouts, API routes)
    │   ├── (storefront)/    # Public routes (shop, product, about, contact, etc.)
    │   ├── admin/           # Protected admin dashboard
    │   ├── api/             # API endpoints (auth, orders, cart, customize, etc.)
    │   └── customize/       # Bespoke garment customization studio
    ├── components/          # Reusable UI & layout components
    ├── generated/           # Generated Prisma client bindings
    ├── lib/                 # Shared utilities, auth, S3 client, email templates
    ├── prisma/              # Prisma schema, database migrations, and seed scripts
    ├── public/              # Static assets (brand logos, icons, fonts)
    └── scripts/             # Migration and operational maintenance scripts
```

---

## ✦ Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: v20+ or **Bun**: v1.1+ (recommended)
- **PostgreSQL**: Local instance or hosted provider (Supabase, Neon, AWS RDS)

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:shrinidhipadgul/aarovi.git
   cd aarovi/web
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` inside the `web/` directory and configure your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Initialize the Database**:
   Push the Prisma schema to your PostgreSQL database and generate the Prisma Client:
   ```bash
   bun run db:push
   bun run db:generate
   ```

   *(Optional)* Seed sample products, categories, and test data:
   ```bash
   bun run db:seed
   ```

5. **Start the Development Server**:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Environment Variables

Configure the following variables in `web/.env`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/aarovi` |
| `BETTER_AUTH_URL` | Application root URL for authentication callbacks | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | Public canonical site URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API key for transactional emails | `re_...` |
| `MAIL_FROM_EMAIL` | Sender address for transactional emails | `House of Aarovi <noreply@aarovi.in>` |
| `ADMIN_NOTIFY_EMAIL` | Administrator inbox for custom order alerts | `admin@aarovi.in` |
| `UPLOAD_ADAPTER` | Storage adapter mode (`"public"` or `"s3"`) | `public` |
| `AWS_REGION` | AWS Region for S3 bucket | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key ID | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Access Key | `...` |
| `S3_BUCKET_NAME` | S3 bucket name for uploads | `aarovi` |
| `S3_PUBLIC_BASE_URL` | Public CDN or bucket URL prefix | `https://cdn.aarovi.in` |
| `RAZORPAY_KEY_ID` | *(Optional)* Razorpay Public Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | *(Optional)* Razorpay Secret Key | `...` |

---

## ✦ Available Scripts

Run these scripts from within the `web/` directory:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `bun run dev` | Starts the Next.js development server |
| `build` | `bun run build` | Builds the production-optimized application |
| `start` | `bun run start` | Runs the production build server |
| `lint` | `bun run lint` | Runs ESLint code quality checks |
| `db:generate` | `bun run db:generate` | Generates Prisma Client types |
| `db:push` | `bun run db:push` | Synchronizes Prisma schema with database |
| `db:seed` | `bun run db:seed` | Seeds database with initial store catalog |
| `db:studio` | `bun run db:studio` | Opens interactive Prisma Studio database GUI |
| `db:migrate-uploads` | `bun run db:migrate-uploads` | Migrates local uploads to AWS S3 storage |

---

## ✦ Intellectual Property & License

**Copyright © 2026 Shaik Imaduddin. All rights reserved.**

All rights, title, and interest in and to this codebase, architecture, designs, and associated assets belong exclusively to **Shaik Imaduddin**.

This software is **Proprietary and Confidential**. Unauthorized copying, distribution, modification, reverse engineering, or public display of this source code, via any medium, is strictly prohibited without the express prior written authorization of **Shaik Imaduddin**.

For full licensing terms and legal restrictions, refer to the [LICENSE](./LICENSE) file.
