-- AlterTable
ALTER TABLE "saga_contexts" ADD COLUMN "correlationId" TEXT NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "saga_contexts_correlationId_key" ON "saga_contexts"("correlationId");
