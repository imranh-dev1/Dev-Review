# Dev Review - Project Review Platform (Backend)

A RESTful API backend for the Dev Review Project Review Platform built with Node.js, Express, TypeScript, Prisma ORM, and Prisma Composer.

## Tech Stack

- **Runtime**: Node.js (>=22.18.0) / Bun (1.4.2)
- **Framework**: Express.js v5
- **Language**: TypeScript
- **ORM**: Prisma ORM v8 (RC) with Prisma Composer
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (Access & Refresh tokens) with HTTP-only cookies
- **File Upload**: Cloudinary + Multer
- **Email**: Nodemailer
- **Validation**: Zod
- **Code Quality**: Biome (linting & formatting)

## Features

- **User Management**: Registration, authentication, role-based access control (STUDENT, REVIEWER, ADMIN)
- **Project Submissions**: Students can submit projects with details, repository/demo links, technologies, and screenshots
- **Review System**: Reviewers can review submissions with detailed criteria (code quality, functionality, UI/UX, responsiveness, accessibility, documentation) and overall scoring
- **Assignment System**: Admins can assign reviewers to submissions
- **Notifications**: Real-time notifications for submission status changes, reviews, assignments
- **Audit Logging**: Comprehensive audit trail for admin actions and system events
- **Analytics**: Platform statistics and insights
- **Email Notifications**: Verification emails, password resets, and status updates
- **File Uploads**: Image uploads via Cloudinary

## Project Structure

```
src/
├── app/
│   ├── config/         # App configuration (env, etc.)
│   ├── lib/            # Third-party integrations (Cloudinary, Multer, Nodemailer, Redis)
│   ├── middleware/     # Express middlewares (auth, validation, error handling)
│   ├── modules/        # Feature modules (auth, user, submission, review, etc.)
│   ├── services/       # Business services (audit, notification, workflow)
│   ├── templates/      # Email templates
│   ├── types/          # Type definitions
│   └── utils/          # Utility functions
├── prisma/             # Prisma schema, contracts, and DB connection
└── app.ts, server.ts   # App entry points
```

## Prerequisites

- Node.js ^22.18.0 || ^24.11.0 || >=26.0.0
- Bun 1.4.2
- PostgreSQL >= 15
- Redis

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure the required environment variables in `.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dev_review_db"

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Redis
REDIS_USER=your_redis_user
REDIS_PASSWORD=your_redis_password
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (SMTP)
SMTP_USER=your_smtp_email
SMTP_PASSWORD=your_smtp_password
SMTP_EMAIL_SENDER=your_sender_email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

```bash
# Install dependencies
bun install
```

## Running the Application

### Development Mode

```bash
# Using Prisma Composer (recommended)
bun run dev:composer

# Or using direct dev server (requires DATABASE_URL)
bun run dev
```

### Production

```bash
# Build and start
bun run build
bun run start
```

### Deploy

```bash
bun run deploy
```

## Database Management

```bash
# Run migrations
bun run migrate

# Check migration status
bun run migration:status

# Plan migrations
bun run migration:plan

# Show migrations
bun run migration:show
```

## Prisma & Contract

The database schema is defined in `src/prisma/contract.prisma`. After making changes to the contract:

```bash
bun run contract:emit
```

Prisma config and Composer setup are in `prisma.config.ts`, `module.ts`, and `service.ts`.

## Code Quality

```bash
# Check formatting
bun run format:check

# Fix formatting
bun run format:fix

# Check linting
bun run linter:check

# Fix linting
bun run linter:fix
```

## API Routes

| Route | Description |
|-------|-------------|
| `/` | Health check |
| `/api/v1/health` | API health status |
| `/api/v1/auth` | Authentication (login, register, logout, etc.) |
| `/api/v1/user` | User management |
| `/api/v1/submissions` | Project submission CRUD |
| `/api/v1` | Review routes |
| `/api/v1/notifications` | Notifications |
| `/api/v1/analytics` | Analytics & statistics |
| `/api/v1/admin/audit-logs` | Audit logs (Admin only) |

## License

Private
