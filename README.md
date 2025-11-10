# IndiePH - Product Hunt Open-Source Product Showcase

IndiePH is a website dedicated to showcasing open-source products featured on Product Hunt. By curating projects with a public GitHub repository, it provides inspiration and learning opportunities for builders and the open-source community.

## Tech Stack

- **Frontend**: Next.js + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Deployment**: Vercel
- **Data Validation**: Zod
- **Icons**: Lucide React

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment variables example file and configure:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file and fill in the following configurations:

- `DATABASE_URL`: Supabase database connection string
- `PRODUCTHUNT_API_TOKEN`: ProductHunt API access token

### 3. Database Initialization

```bash
# Generate database migration files
npm run db:generate

# Execute database migrations
npm run db:migrate
```

### 4. Pull Product Hunt Data

```bash
# Pull latest products from Product Hunt API
npm run sync-all -- --date=2025-01-01
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   └── ...             # Business components
├── lib/                # Utility libraries and configurations
│   └── db/             # Database related
│       ├── schema.ts   # Database table structure definitions
│       ├── index.ts    # Database connection configuration
│       └── test-connection.ts # Database connection test
├── types/              # TypeScript type definitions
├── store/              # Zustand state management
├── hooks/              # Custom React Hooks
└── utils/              # Utility functions
```

## Available Scripts

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server

### Code Quality

- `npm run lint` - ESLint check
- `npm run format` - Code formatting
- `npm run format:check` - Check code format
- `npm run type-check` - TypeScript type checking
- `npm run check-all` - Run all checks

### Database Management

- `npm run db:generate` - Generate database migration files
- `npm run db:migrate` - Execute database migrations

## Database Design

### Table Structure

#### post Table (Product Information)

- `id`: Auto-increment primary key
- `post_id`: ProductHunt product ID (unique)
- `name`: Product name
- `tagline`: Product tagline
- `thumbnail`: Product thumbnail URL
- `url`: ProductHunt product page URL
- `website`: Product official website URL
- `created_at`: Product creation time
- `makers`: Number of creators
- `twitter/facebook/linkedin/instagram/github`: Social media links
- `enable`: Product enable status

#### sync_logs Table (Sync Logs)

- `id`: Auto-increment primary key
- `sync_time`: Sync start time
- `status`: Sync status (success/failed/partial)
- `duration_ms`: Sync duration (milliseconds)
- `total_fetched`: Total number of products fetched
- `new_products`: Number of new products
- `updated_products`: Number of updated products
- `discard_products`: Number of discarded products
- `failed_products`: Number of failed products
- `error_message`: Error message
- `trigger_source`: Trigger source (manual/cron/api)
- `created_at`: Record creation time

### Index Optimization

- `post_id`: Unique index (ProductHunt product ID)
- `created_at`: Regular index (for time sorting)
- `enable`: Regular index (for status filtering)
- `sync_time`: Regular index (sync log time queries)
- `status`: Regular index (sync status filtering)

## Features

- 📱 Responsive design, supports mobile and desktop
- 🔄 Infinite scroll pagination
- 🎨 Modern UI design
- 🚀 Server-side rendering (SSR) for SEO optimization
- 📊 Automatic product data synchronization
- 🔍 Product filtering based on GitHub repository presence
- 🗄️ Complete database design and migration system

## API Endpoints

- `GET /api/posts` - Get product list

## Deployment

The project is configured for deployment on Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Automatic deployment complete
