/*
  Warnings:

  - You are about to drop the column `channel` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `channelSlug` on the `ComplianceChecklist` table. All the data in the column will be lost.
  - You are about to drop the column `targetChannel` on the `ContentBrief` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `MediaAsset` table. All the data in the column will be lost.
  - You are about to drop the column `channelSlug` on the `MetricSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `PromptTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `channelSlug` on the `PublicationLog` table. All the data in the column will be lost.
  - You are about to drop the column `publicationId` on the `PublicationLog` table. All the data in the column will be lost.
  - You are about to drop the column `channelSlug` on the `PublicationPlan` table. All the data in the column will be lost.
  - Added the required column `slug` to the `AffiliateProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `ComplianceChecklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `ContentBrief` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `MetricSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `PublicationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicationPlanId` to the `PublicationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `PublicationPlan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AffiliateProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT,
    "affiliateUrl" TEXT,
    "priceRange" TEXT,
    "notes" TEXT,
    "isPriority" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AffiliateProduct" ("affiliateUrl", "brand", "category", "createdAt", "id", "isPriority", "name", "notes", "priceRange", "updatedAt") SELECT "affiliateUrl", "brand", "category", "createdAt", "id", "isPriority", "name", "notes", "priceRange", "updatedAt" FROM "AffiliateProduct";
DROP TABLE "AffiliateProduct";
ALTER TABLE "new_AffiliateProduct" RENAME TO "AffiliateProduct";
CREATE UNIQUE INDEX "AffiliateProduct_slug_key" ON "AffiliateProduct"("slug");
CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "notes" TEXT,
    "channelId" TEXT NOT NULL,
    "affiliateProductId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Campaign_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_affiliateProductId_fkey" FOREIGN KEY ("affiliateProductId") REFERENCES "AffiliateProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("createdAt", "endDate", "id", "name", "notes", "objective", "startDate", "status", "updatedAt") SELECT "createdAt", "endDate", "id", "name", "notes", "objective", "startDate", "status", "updatedAt" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE TABLE "new_ComplianceChecklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "rulesJson" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" DATETIME,
    "channelId" TEXT NOT NULL,
    "campaignId" TEXT,
    "contentBriefId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComplianceChecklist_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ComplianceChecklist_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ComplianceChecklist_contentBriefId_fkey" FOREIGN KEY ("contentBriefId") REFERENCES "ContentBrief" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ComplianceChecklist" ("createdAt", "id", "isApproved", "reviewedAt", "rulesJson", "title") SELECT "createdAt", "id", "isApproved", "reviewedAt", "rulesJson", "title" FROM "ComplianceChecklist";
DROP TABLE "ComplianceChecklist";
ALTER TABLE "new_ComplianceChecklist" RENAME TO "ComplianceChecklist";
CREATE TABLE "new_ContentBrief" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "targetPersona" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "payloadJson" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "campaignId" TEXT,
    "promptTemplateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentBrief_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentBrief_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ContentBrief_promptTemplateId_fkey" FOREIGN KEY ("promptTemplateId") REFERENCES "PromptTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentBrief" ("createdAt", "id", "objective", "payloadJson", "status", "targetPersona", "title", "updatedAt") SELECT "createdAt", "id", "objective", "payloadJson", "status", "targetPersona", "title", "updatedAt" FROM "ContentBrief";
DROP TABLE "ContentBrief";
ALTER TABLE "new_ContentBrief" RENAME TO "ContentBrief";
CREATE TABLE "new_MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "source" TEXT,
    "metadataJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MediaAsset" ("createdAt", "id", "metadataJson", "name", "path", "source", "type") SELECT "createdAt", "id", "metadataJson", "name", "path", "source", "type" FROM "MediaAsset";
DROP TABLE "MediaAsset";
ALTER TABLE "new_MediaAsset" RENAME TO "MediaAsset";
CREATE TABLE "new_MetricSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metricType" TEXT NOT NULL,
    "metricValue" REAL NOT NULL,
    "snapshotAt" DATETIME NOT NULL,
    "channelId" TEXT NOT NULL,
    "campaignId" TEXT,
    "publicationPlanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MetricSnapshot_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MetricSnapshot_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MetricSnapshot_publicationPlanId_fkey" FOREIGN KEY ("publicationPlanId") REFERENCES "PublicationPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MetricSnapshot" ("campaignId", "createdAt", "id", "metricType", "metricValue", "snapshotAt") SELECT "campaignId", "createdAt", "id", "metricType", "metricValue", "snapshotAt" FROM "MetricSnapshot";
DROP TABLE "MetricSnapshot";
ALTER TABLE "new_MetricSnapshot" RENAME TO "MetricSnapshot";
CREATE TABLE "new_PromptTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "format" TEXT,
    "body" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "channelId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PromptTemplate_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PromptTemplate" ("active", "body", "createdAt", "format", "id", "name", "objective", "updatedAt", "version") SELECT "active", "body", "createdAt", "format", "id", "name", "objective", "updatedAt", "version" FROM "PromptTemplate";
DROP TABLE "PromptTemplate";
ALTER TABLE "new_PromptTemplate" RENAME TO "PromptTemplate";
CREATE UNIQUE INDEX "PromptTemplate_name_channelId_key" ON "PromptTemplate"("name", "channelId");
CREATE TABLE "new_PublicationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT,
    "postedAt" DATETIME,
    "outcome" TEXT NOT NULL,
    "notes" TEXT,
    "publicationPlanId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PublicationLog_publicationPlanId_fkey" FOREIGN KEY ("publicationPlanId") REFERENCES "PublicationPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PublicationLog_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PublicationLog" ("createdAt", "id", "notes", "outcome", "postedAt", "url") SELECT "createdAt", "id", "notes", "outcome", "postedAt", "url" FROM "PublicationLog";
DROP TABLE "PublicationLog";
ALTER TABLE "new_PublicationLog" RENAME TO "PublicationLog";
CREATE TABLE "new_PublicationPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "scheduledFor" DATETIME NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "channelId" TEXT NOT NULL,
    "campaignId" TEXT,
    "contentBriefId" TEXT,
    "checklistId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PublicationPlan_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PublicationPlan_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PublicationPlan_contentBriefId_fkey" FOREIGN KEY ("contentBriefId") REFERENCES "ContentBrief" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PublicationPlan_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "ComplianceChecklist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PublicationPlan" ("campaignId", "createdAt", "format", "id", "scheduledFor", "status", "title") SELECT "campaignId", "createdAt", "format", "id", "scheduledFor", "status", "title" FROM "PublicationPlan";
DROP TABLE "PublicationPlan";
ALTER TABLE "new_PublicationPlan" RENAME TO "PublicationPlan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
