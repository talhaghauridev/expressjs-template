CREATE TYPE "public"."auth_provider" AS ENUM('custom', 'google', 'facebook', 'github');
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');
CREATE TYPE "public"."platform" AS ENUM('web', 'mobile');
CREATE TYPE "public"."verification_type" AS ENUM('email', 'password_reset');
CREATE TYPE "public"."location_type" AS ENUM('registration', 'last_login');
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(60),
	"provider_id" varchar(255),
	"provider" "auth_provider" DEFAULT 'custom' NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"profile_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "verification_type" NOT NULL,
	"platform" "platform" NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "user_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "location_type" NOT NULL,
	"country" varchar(100),
	"city" varchar(100),
	"ip" varchar(45),
	"platform" "platform" NOT NULL,
	"device" varchar(100),
	"browser" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "verifications" ADD CONSTRAINT "verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");
CREATE UNIQUE INDEX "provider_user_idx" ON "users" USING btree ("provider","provider_id");
CREATE INDEX "user_type_platform_idx" ON "verifications" USING btree ("user_id","type","platform");
CREATE INDEX "user_id_type_idx" ON "user_locations" USING btree ("user_id","type");