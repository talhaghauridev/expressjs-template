CREATE TYPE "public"."auth_provider" AS ENUM('custom', 'google', 'facebook', 'github');
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');
CREATE TYPE "public"."platform" AS ENUM('web', 'mobile');
CREATE TYPE "public"."verification_type" AS ENUM('email', 'password_reset');
CREATE TYPE "public"."location_type" AS ENUM('registration', 'last_login');
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

ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(100);
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(60);
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(100);
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "users" ADD COLUMN "provider_id" varchar(255);
ALTER TABLE "users" ADD COLUMN "provider" "auth_provider" DEFAULT 'custom' NOT NULL;
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN "profile_completed" boolean DEFAULT false NOT NULL;
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "user_type_platform_idx" ON "verifications" USING btree ("user_id","type","platform");
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");
CREATE UNIQUE INDEX "provider_user_idx" ON "users" USING btree ("provider","provider_id");
ALTER TABLE "users" DROP COLUMN "is_active";