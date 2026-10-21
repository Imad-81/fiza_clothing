# Style By Fiza — Web Frontend & API

This directory contains the primary web application and API service for **Style By Fiza** (Online Ready to Wear), built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Prisma ORM, and Better Auth.

For comprehensive documentation, project architecture, setup instructions, and environment variables, please refer to the [Root README](../README.md).

## Quick Start

```bash
# Install dependencies
bun install

# Setup environment variables
cp .env.example .env

# Push database schema & generate Prisma client
bun run db:push
bun run db:generate

# Start local development server
bun run dev
```

## License & Ownership

**Copyright © 2026 Shaik Imaduddin. All rights reserved.**

All rights to this codebase belong to **Shaik Imaduddin**. See [LICENSE](../LICENSE) for details.
