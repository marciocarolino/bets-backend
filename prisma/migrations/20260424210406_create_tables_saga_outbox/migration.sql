-- CreateEnum
CREATE TYPE "SagaContextStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'COMPENSATING', 'COMPENSATED');

-- CreateEnum
CREATE TYPE "OutboxMessageStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "saga_contexts" (
    "id" TEXT NOT NULL,
    "sagaName" TEXT NOT NULL,
    "externalId" TEXT,
    "rawDataHash" TEXT NOT NULL,
    "status" "SagaContextStatus" NOT NULL DEFAULT 'PENDING',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "rawData" JSONB NOT NULL,
    "processData" JSONB NOT NULL DEFAULT '{}',
    "logs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saga_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_messages" (
    "id" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxMessageStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "outbox_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saga_contexts_status_updatedAt_idx" ON "saga_contexts"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "saga_contexts_sagaName_rawDataHash_key" ON "saga_contexts"("sagaName", "rawDataHash");

-- CreateIndex
CREATE UNIQUE INDEX "saga_contexts_sagaName_externalId_key" ON "saga_contexts"("sagaName", "externalId");

-- CreateIndex
CREATE INDEX "outbox_messages_status_createdAt_idx" ON "outbox_messages"("status", "createdAt");
