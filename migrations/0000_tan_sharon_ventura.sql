CREATE TABLE "exercises" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" varchar NOT NULL,
	"name" text NOT NULL,
	"sets" integer,
	"reps" integer,
	"weight" text,
	"notes" text,
	"day" integer NOT NULL,
	"order_index" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"coach_id" varchar NOT NULL,
	"client_id" varchar,
	"duration_weeks" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"is_pro" boolean DEFAULT false NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"coach_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
