CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_plan_check" CHECK ("plan" IN ('FREE', 'PERSONAL', 'FAMILY'))
);

CREATE TABLE IF NOT EXISTS "Capsule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "unlocksAt" TIMESTAMP(3) NOT NULL,
    "unlockedAt" TIMESTAMP(3),
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "schedulerJobId" TEXT,

    CONSTRAINT "Capsule_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Capsule_status_check" CHECK ("status" IN ('DRAFT', 'LOCKED', 'UNLOCKED'))
);

CREATE TABLE IF NOT EXISTS "CapsuleContent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "body" TEXT,
    "mediaUrl" TEXT,
    "mediaKey" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capsuleId" TEXT NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "CapsuleContent_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CapsuleContent_type_check" CHECK ("type" IN ('TEXT', 'IMAGE', 'VIDEO', 'VOICE'))
);

CREATE TABLE IF NOT EXISTS "CapsuleRecipient" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capsuleId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "CapsuleRecipient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CapsuleContribution" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capsuleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CapsuleContribution_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX ASYNC IF NOT EXISTS "User_clerkId_key" ON "User"("clerkId");

CREATE UNIQUE INDEX ASYNC IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX ASYNC IF NOT EXISTS "CapsuleRecipient_capsuleId_email_key" ON "CapsuleRecipient"("capsuleId", "email");

CREATE UNIQUE INDEX ASYNC IF NOT EXISTS "CapsuleContribution_capsuleId_userId_key" ON "CapsuleContribution"("capsuleId", "userId");

CREATE INDEX ASYNC IF NOT EXISTS "Capsule_authorId_idx" ON "Capsule"("authorId");

CREATE INDEX ASYNC IF NOT EXISTS "CapsuleContent_capsuleId_idx" ON "CapsuleContent"("capsuleId");

CREATE INDEX ASYNC IF NOT EXISTS "CapsuleRecipient_capsuleId_idx" ON "CapsuleRecipient"("capsuleId");

CREATE INDEX ASYNC IF NOT EXISTS "CapsuleRecipient_userId_idx" ON "CapsuleRecipient"("userId");

CREATE INDEX ASYNC IF NOT EXISTS "CapsuleContribution_capsuleId_idx" ON "CapsuleContribution"("capsuleId");

CREATE INDEX ASYNC IF NOT EXISTS "CapsuleContribution_userId_idx" ON "CapsuleContribution"("userId");
