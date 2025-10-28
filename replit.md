# CoachPro - Sports Coaching Platform

## Overview

CoachPro is a SaaS platform for fitness coaching inspired by TrueCoach. It enables coaches to manage clients, create workout programs, and leverage AI-powered coaching assistance. Clients can view their personalized training programs, track progress, and interact with an AI coach for fitness and nutrition guidance.

The platform features role-based access (coaches and clients), subscription management via Stripe, and AI-powered chat capabilities using OpenAI's GPT-5 model through Replit's AI Integrations service.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Framework:**
- Tailwind CSS for utility-first styling with custom design tokens
- shadcn/ui component library based on Radix UI primitives
- Custom design system inspired by Linear, Notion, and TrueCoach (see design_guidelines.md)
- Responsive layouts with mobile-first approach

**State Management:**
- TanStack Query handles all server state, eliminating need for Redux/Context
- Local state managed with React hooks
- JWT tokens stored in localStorage for authentication persistence

**Design Decisions:**
- Chose Vite over Create React App for faster development experience and better build performance
- Selected Wouter over React Router for smaller bundle size in a SaaS application
- Implemented shadcn/ui over Material-UI to maintain full control over component styling and behavior
- Used TanStack Query to automatically handle loading states, error handling, and cache invalidation

### Backend Architecture

**Technology Stack:**
- Node.js with Express for the REST API server
- TypeScript for type safety across the entire codebase
- Drizzle ORM for type-safe database queries

**Authentication & Authorization:**
- JWT-based authentication using jsonwebtoken library
- Bcrypt for password hashing (6 rounds for balance of security and performance)
- Session secret stored in environment variable (SESSION_SECRET)
- Auth middleware protects all authenticated routes
- Role-based access control (coach vs client roles)

**API Design:**
- RESTful endpoints organized by resource type
- Consistent error handling with appropriate HTTP status codes
- Request validation using Zod schemas from shared directory
- Auth token passed via Authorization header as Bearer token

**Architecture Decisions:**
- Chose JWT over session-based auth for stateless API that scales horizontally
- Selected Express over Fastify for wider ecosystem and team familiarity
- Implemented Drizzle ORM over Prisma for better TypeScript integration and lighter weight
- Used middleware pattern for authentication to keep route handlers clean

### Database Architecture

**Database:** PostgreSQL accessed via Replit's managed database service

**ORM:** Drizzle ORM with Neon serverless driver for connection pooling

**Schema Design:**
- `users` table: Stores both coaches and clients with role-based differentiation
  - Coaches have `isPro` flag and Stripe subscription fields
  - Clients reference their coach via `coachId` foreign key
- `programs` table: Training programs created by coaches
  - Links to both coach (creator) and client (assignee)
  - Status field tracks lifecycle: draft → active → completed
- `exercises` table: Individual exercises within programs
  - Organized by day and order within day
  - Tracks completion status for progress monitoring
- `messages` table: Stores AI coach conversation history
  - Links to user for personalized context
  - Stores both user questions and AI responses

**Migration Strategy:**
- Schema defined in shared/schema.ts for type sharing between client/server
- Drizzle Kit used for migration generation and execution
- Database provisioned automatically by Replit with connection details in environment variables

**Architectural Decisions:**
- Chose PostgreSQL over MongoDB for relational data and strong consistency guarantees
- Used single users table with role field instead of separate coach/client tables to simplify authentication
- Stored messages in database rather than ephemeral for conversation history and future analytics
- Implemented soft relationships (varchar IDs) rather than numeric IDs for better UUID support

### AI Integration

**Provider:** OpenAI GPT-5 via Replit's AI Integrations service

**Implementation:**
- Centralized OpenAI client configuration in server/openai.ts
- AI_MODEL constant set to "gpt-5" (latest model as of August 2025)
- System prompt defines AI coach personality and expertise areas
- Max completion tokens limited to 500 for concise responses

**Conversation Design:**
- Each message request sends full context (system prompt + user message)
- No conversation history sent to reduce token usage
- Responses stored in database for user's conversation history
- French language responses for target market

**Architectural Decisions:**
- Used Replit AI Integrations to avoid managing OpenAI API keys
- Limited response length to prevent overly verbose answers
- Stateless AI requests for simplicity, with history managed in database
- French-first approach aligns with target coaching market

### Payment Processing

**Provider:** Stripe for subscription billing

**Integration Points:**
- Stripe checkout session creation for coach subscription upgrades
- Webhook handling for payment confirmations (expects raw body)
- Customer and subscription ID stored on user records
- Frontend uses @stripe/stripe-js and @stripe/react-stripe-js

**Subscription Model:**
- Free tier for coaches (basic features)
- Pro tier unlocks advanced features via Stripe subscription
- Client accounts are always free (revenue from coaches only)

**Security Considerations:**
- Webhook signature verification using raw request body
- Stripe public/secret keys separated (public key in Vite, secret in backend)
- Subscription status checked server-side before feature access

**Architectural Decisions:**
- Chose Stripe over other payment processors for robust subscription management
- Implemented webhook-based status updates for reliability
- Stored minimal payment data (customer/subscription IDs only) to reduce PCI scope
- Used Stripe Checkout instead of custom payment forms for faster implementation and better security

## External Dependencies

### Third-Party Services

**Replit Platform Services:**
- PostgreSQL database (managed, auto-configured via DATABASE_URL)
- AI Integrations for OpenAI API access (AI_INTEGRATIONS_OPENAI_BASE_URL and API_KEY)
- Development environment and deployment infrastructure

**Stripe:**
- Payment processing and subscription management
- Required environment variables: STRIPE_SECRET_KEY (server), VITE_STRIPE_PUBLIC_KEY (client)
- API version: 2023-10-16

**OpenAI (via Replit AI Integrations):**
- GPT-5 model for AI coach responses
- Accessed through Replit's proxy for simplified authentication

### Key NPM Dependencies

**Frontend:**
- React 18 (UI framework)
- TanStack Query v5 (server state management)
- Wouter (routing)
- Radix UI primitives (accessible component foundation)
- Tailwind CSS (styling)
- Zod (schema validation)

**Backend:**
- Express (web framework)
- Drizzle ORM with @neondatabase/serverless (database)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- Stripe SDK (payment processing)
- OpenAI SDK (AI integration)

**Development:**
- TypeScript (type safety)
- Vite (build tool)
- tsx (TypeScript execution for development)
- esbuild (production builds)

### Environment Variables

**Auto-configured by Replit:**
- DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
- AI_INTEGRATIONS_OPENAI_BASE_URL, AI_INTEGRATIONS_OPENAI_API_KEY

**User-configured:**
- SESSION_SECRET (JWT signing key - required)
- STRIPE_SECRET_KEY (server-side Stripe access - required)
- VITE_STRIPE_PUBLIC_KEY (client-side Stripe access - required)