-- CreateTable
CREATE TABLE "ContentMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mainProduct" TEXT NOT NULL,
    "mainCompetitor" TEXT NOT NULL,
    "mainBrand" TEXT NOT NULL,
    "competitorBrand" TEXT NOT NULL,
    "primaryKeyword" TEXT NOT NULL,
    "secondaryKeywords" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "funnelLevel" TEXT NOT NULL,
    "editorialSummary" TEXT NOT NULL,
    "valueProposition" TEXT NOT NULL,
    "advantages" TEXT NOT NULL,
    "disadvantages" TEXT NOT NULL,
    "whereToUse" TEXT NOT NULL,
    "whereNotToUse" TEXT NOT NULL,
    "technicalAssessment" TEXT NOT NULL,
    "commonFailureParts" TEXT NOT NULL,
    "preventiveMaintenance" TEXT NOT NULL,
    "durabilityCare" TEXT NOT NULL,
    "finalDecision" TEXT NOT NULL,
    "mainCta" TEXT NOT NULL,
    "affiliateLinksJson" TEXT NOT NULL,
    "youtubeLinks" TEXT,
    "blogLinks" TEXT,
    "socialLinks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BlogDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentMasterId" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "h2h3Blocks" TEXT NOT NULL,
    "technicalComparison" TEXT NOT NULL,
    "advantagesDisadvantages" TEXT NOT NULL,
    "usageGuide" TEXT NOT NULL,
    "maintenanceGuide" TEXT NOT NULL,
    "wearParts" TEXT NOT NULL,
    "finalConclusion" TEXT NOT NULL,
    "faq" TEXT NOT NULL,
    "affiliateLinksBlock" TEXT NOT NULL,
    "youtubeBlock" TEXT NOT NULL,
    "socialLinksBlock" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlogDraft_contentMasterId_fkey" FOREIGN KEY ("contentMasterId") REFERENCES "ContentMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChannelContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentMasterId" TEXT NOT NULL,
    "channelType" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "copy" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "hashtags" TEXT NOT NULL,
    "visualPrompt" TEXT NOT NULL,
    "copyPrompt" TEXT NOT NULL,
    "videoPrompt" TEXT NOT NULL,
    "artSpec" TEXT NOT NULL,
    "strategicNotes" TEXT NOT NULL,
    "productionStatus" TEXT NOT NULL DEFAULT 'draft',
    "publicationStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChannelContent_contentMasterId_fkey" FOREIGN KEY ("contentMasterId") REFERENCES "ContentMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreativeAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentMasterId" TEXT NOT NULL,
    "channelContentId" TEXT,
    "title" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "subheadline" TEXT NOT NULL,
    "visualCta" TEXT NOT NULL,
    "artText" TEXT NOT NULL,
    "visualDirection" TEXT NOT NULL,
    "visualStyle" TEXT NOT NULL,
    "ratioFormat" TEXT NOT NULL,
    "coverReference" TEXT,
    "imagePrompt" TEXT NOT NULL,
    "variationPrompt" TEXT NOT NULL,
    "artStatus" TEXT NOT NULL DEFAULT 'draft',
    "finalApprovedVersion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CreativeAsset_contentMasterId_fkey" FOREIGN KEY ("contentMasterId") REFERENCES "ContentMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreativeAsset_channelContentId_fkey" FOREIGN KEY ("channelContentId") REFERENCES "ChannelContent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "contentMasterId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Campaign_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_affiliateProductId_fkey" FOREIGN KEY ("affiliateProductId") REFERENCES "AffiliateProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Campaign_contentMasterId_fkey" FOREIGN KEY ("contentMasterId") REFERENCES "ContentMaster" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("affiliateProductId", "channelId", "createdAt", "endDate", "id", "name", "notes", "objective", "startDate", "status", "updatedAt") SELECT "affiliateProductId", "channelId", "createdAt", "endDate", "id", "name", "notes", "objective", "startDate", "status", "updatedAt" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
