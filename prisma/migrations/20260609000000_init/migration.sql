-- CreateTable
CREATE TABLE "User" (
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

-- CreateTable
CREATE TABLE "Capsule" (
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

-- CreateTable
CREATE TABLE "CapsuleContent" (
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

-- CreateTable
CREATE TABLE "CapsuleRecipient" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capsuleId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "CapsuleRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapsuleContribution" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capsuleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CapsuleContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CapsuleRecipient_capsuleId_email_key" ON "CapsuleRecipient"("capsuleId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "CapsuleContribution_capsuleId_userId_key" ON "CapsuleContribution"("capsuleId", "userId");

-- AddForeignKey
ALTER TABLE "Capsule" ADD CONSTRAINT "Capsule_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleContent" ADD CONSTRAINT "CapsuleContent_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleRecipient" ADD CONSTRAINT "CapsuleRecipient_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleRecipient" ADD CONSTRAINT "CapsuleRecipient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleContribution" ADD CONSTRAINT "CapsuleContribution_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleContribution" ADD CONSTRAINT "CapsuleContribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
