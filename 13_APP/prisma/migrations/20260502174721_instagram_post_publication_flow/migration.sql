-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PublicationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "url" TEXT,
    "postedAt" DATETIME,
    "outcome" TEXT,
    "notes" TEXT,
    "publicationPlanId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PublicationLog_publicationPlanId_fkey" FOREIGN KEY ("publicationPlanId") REFERENCES "PublicationPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PublicationLog_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PublicationLog" ("channelId", "createdAt", "id", "notes", "outcome", "postedAt", "publicationPlanId", "url") SELECT "channelId", "createdAt", "id", "notes", "outcome", "postedAt", "publicationPlanId", "url" FROM "PublicationLog";
DROP TABLE "PublicationLog";
ALTER TABLE "new_PublicationLog" RENAME TO "PublicationLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
