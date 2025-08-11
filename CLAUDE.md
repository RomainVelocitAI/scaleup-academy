# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application with TypeScript, focusing on creating an online academy platform with Supabase backend integration, Stripe payment processing, and React Query for state management.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture and Key Technologies

### Tech Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript with strict mode enabled
- **Database/Auth**: Supabase (SSR and client SDK)
- **State Management**: Zustand + React Query (TanStack Query v5)
- **Payments**: Stripe integration
- **Styling**: Tailwind CSS v4 with tailwindcss-animate
- **Forms**: React Hook Form with Zod validation
- **UI Components**: class-variance-authority (CVA) for component variants

### Project Structure
- **src/app/**: Next.js App Router pages and layouts
- **Path Alias**: `@/*` maps to `./src/*`
- **Font System**: Uses Geist font family (Sans and Mono variants)

### Key Dependencies
- **Media Handling**: react-player for video, react-pdf for documents
- **Content**: react-markdown for markdown rendering
- **Date Utilities**: date-fns
- **Icons**: lucide-react
- **Utilities**: clsx + tailwind-merge for className management

## Important Configuration Notes

- TypeScript target: ES2017 with strict mode
- Module resolution: bundler (Next.js optimized)
- CSS: Tailwind CSS v4 with PostCSS configuration
- ESLint: Next.js core-web-vitals and TypeScript rules

## Development Patterns

When implementing features, consider:
- Use React Server Components by default, client components only when needed
- Leverage Supabase SSR for authentication and data fetching
- Implement proper error boundaries and loading states with React Query
- Use Zod schemas for runtime validation with React Hook Form
- Apply CVA for consistent component variant patterns