# Contributing to Flagix

Thank you for your interest in contributing! This guide explains how to get Flagix running locally and how to submit contributions.

## Prerequisites

Before you start, make sure you have the following installed or available:

- **Node.js** ≥ 18.x
- **pnpm** ≥ 9.x (install with `npm i -g pnpm`)
- **PostgreSQL** database (we use Neon)
- **Redis** database (we use Upstash)
- **Google**, **GitHub**, and **Discord** OAuth apps (for authentication)
- **Resend** account (for email notifications)
- **Tinybird** account (for analytics)

## Structure

This repository is a monorepo and is structured as follows:

```
/
├── apps/
│   ├── api/        → Express.js API backend
│   ├── web/        → Next.js dashboard
│   └── docs/       → Documentation site
├── packages/
│   ├── db/         → Prisma schema + client
│   ├── data-sync/  → Data synchronization utilities
│   └── evaluation-core/ → Flag evaluation logic
│   └── tinybird/ → Analytics pipeline configurations
│   └── tsconfig/ → Shared TS config
│   └── UI/ → UI components
├── sdk/
│   ├── javascript/ → JavaScript SDK
│   └── react/      → React SDK
├── .github/
│   └── workflows/  → CI/CD configurations
├── .npmrc
├── biome.jsonc
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

### Apps

This directory contains the source code for all related applications:

- **api**: An Express.js app serving the REST API
- **web**: A Next.js app for the dashboard
- **docs**: A Next.js app for documentation

### Packages

Packages contain internal shared modules used across different applications:

- **db**: Database client and schema shared between applications
- **data-sync**: Data synchronization utilities
- **evaluation-core**: Core logic for flag evaluation and targeting
- **tinybird**: Analytics pipeline configurations
- **tsconfig**: Shared TS config
- **UI**: UI components

### SDKs

Publicly published SDKs for integrating Flagix into applications:

- **javascript**: Vanilla JavaScript SDK
- **react**: React-specific SDK

## Getting Started

### 1. Fork this repository

Visit the Flagix repository and click the "Fork" button in the top right.

### 2. Clone the fork to your local device

```bash
git clone https://github.com/flagix-io/flagix.git
cd flagix
```

### 3. Add the original repo as upstream

```bash
git remote add upstream https://github.com/flagix-io/flagix.git
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Configure Environment Variables

Each app has an example env file. You'll need to copy and fill those out:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp packages/db/.env.example packages/db/.env
cp packages/data-sync/.env.example packages/data-sync/.env
```

You'll need:

- A Postgres connection string (Neon)
- Redis credentials (Upstash) 
- OAuth credentials (Google or github or discord)
- A BetterAuth secret
- Resend API key for emails
- Tinybird token for analytics

### 6. Database Setup (Neon)

We use Neon for the database. Create a Neon project and copy your connection string for Prisma (ensure it includes `sslmode=require`).

Paste it into the relevant env files:

```bash
# apps/api/.env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"

# packages/db/.env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

Run migrations:

```bash
pnpm db:migrate
```

### 7. Set up OAuth Providers

#### Google OAuth

1. Create a project in the Google Cloud Console
2. Go to "APIs & Services" → "Credentials"
3. Click "Create Credentials" → "OAuth client ID"
4. Select "Web application"
5. Add authorized redirect URI: `http://localhost:5000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your env files

#### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:5000/api/auth/callback/github`
5. Copy the Client ID and Client Secret to your env files

#### Discord OAuth

1. Go to the Discord Developer Portal and log in.
2. Click "New Application" and give it a name (e.g., Flagix Dev).
3. Navigate to "OAuth2" → "General" in the sidebar.
4. Click "Add Redirect" and enter: `http://localhost:5000/api/auth/callback/discord`
5. Click "Save Changes".
6. Copy your Client ID and Client Secret to your env files.

### 8. Set up Redis

Flagix uses Redis for caching and real-time features. We use Upstash for serverless Redis:

1. Go to Upstash Console and sign in
2. Click "Create Database"
3. Give your database a name (e.g., flagix-redis)
4. Select a region close to you
5. Click "Create"
6. Copy the REST URL and token to your env files:

```bash
# apps/api/.env
REDIS_URL=<YOUR_UPSTASH_REDIS_REST_URL>
```

### 9. Set up Resend (Email)

1. Create an account at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your env file:

```bash
# apps/api/.env
RESEND_API_KEY=<YOUR_RESEND_API_KEY>
```

### 10. Set up Tinybird (Analytics)

1. Create an account at [Tinybird](https://tinybird.co)
2. Create a new project and get your token
3. Add it to your env file:

```bash
# apps/api/.env
TINYBIRD_TOKEN=<YOUR_TINYBIRD_TOKEN>
```

## Running the Apps

From the root you can run all apps:

```bash
pnpm dev
```

Or run individual apps:

```bash
pnpm web:dev    
pnpm api:dev    
```

## Making Changes

### 1. Create a new branch

```bash
git checkout -b feature/your-feature
```

### 2. Code Style

Before committing your changes, run the lint command to catch any formatting errors:

```bash
pnpm lint
```

To fix formatting issues automatically:

```bash
pnpm format
```

### 3. Test your changes

Make sure they work and run a build:

```bash
pnpm build
```

### 4. Commit your changes

Use conventional commit messages:

```bash
git commit -m "feat(api): add user targeting rules"
git commit -m "fix(web): resolve flag toggle animation"
git commit -m "docs: update SDK installation guide"
```

## Pull Request Guidelines

- Your PR should reference an issue (if applicable) or clearly describe its impact
- Include a clear description of the changes
- Keep PRs small and focused. Large PRs are harder to review
- Ensure consistency with the existing codebase
- Include tests if applicable
- Update documentation if your changes affect usage or API behavior

## Code Style

- Follow the existing code formatting in the project (use Biome for consistency)
- Write clear, self-documenting code
- Add comments only when necessary to explain complex logic
- Use meaningful variable and function names
- Follow TypeScript best practices

## Testing

- Run `pnpm build` to ensure all packages build successfully
- Test your changes manually in the web interface
- For SDK changes, test with the example applications
- Ensure database migrations work correctly

## Reporting Issues

- Use the GitHub issue tracker
- Provide a clear description of the issue
- Include steps to reproduce the issue
- Add relevant logs or screenshots

Feel free to send in prss!
Thank you for contributing! 
