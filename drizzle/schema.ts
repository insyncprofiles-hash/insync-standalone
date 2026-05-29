import { mysqlTable, varchar, text, timestamp, int, tinyint } from "drizzle-orm/mysql-core";

/**
 * Profiles table — stores each support worker's profile data.
 * The pid (profile ID) is a short random string used in the shareable client link.
 * No user authentication required — any device can save/load a profile by pid.
 */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  /** Short random ID used in the shareable link: /view?pid=abc123 */
  pid: varchar("pid", { length: 32 }).notNull().unique(),
  /** Full JSON blob of the profile data */
  data: text("data").notNull(),
  /** Optional: base64 profile image stored separately */
  profileImage: text("profileImage"),
  /** Optional: video URL */
  videoUrl: varchar("videoUrl", { length: 2048 }),
  /** 1 = worker has opted in to appear on the Live Wall, 0 = not listed */
  listedOnWall: tinyint("listed_on_wall").notNull().default(0),
  /** available | limited | unavailable — shown as dot on wall tile */
  wallAvailability: varchar("wall_availability", { length: 16 }).notNull().default("available"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * Licence keys pool — owner pre-loads keys here.
 * Each key is assigned to exactly one buyer on payment.
 */
export const licenceKeys = mysqlTable("licence_keys", {
  id: int("id").autoincrement().primaryKey(),
  /** Plain-text key e.g. ISP-A3B2-C1D4-E5F6 */
  keyPlain: varchar("key_plain", { length: 64 }).notNull().unique(),
  /** SHA-256 hash of the key (uppercase) — baked into the client bundle */
  keyHash: varchar("key_hash", { length: 64 }).notNull().unique(),
  /** solo | team | bundle */
  tier: varchar("tier", { length: 16 }).notNull().default("solo"),
  /** null = available, set to purchaseId once assigned */
  assignedToPurchaseId: int("assigned_to_purchase_id"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LicenceKey = typeof licenceKeys.$inferSelect;
export type InsertLicenceKey = typeof licenceKeys.$inferInsert;

/**
 * Purchase records — one row per completed PayPal payment.
 */
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  /** PayPal transaction ID */
  txnId: varchar("txn_id", { length: 128 }).notNull().unique(),
  /** Buyer's email from PayPal */
  buyerEmail: varchar("buyer_email", { length: 255 }).notNull(),
  /** Buyer's full name from PayPal */
  buyerName: varchar("buyer_name", { length: 255 }).notNull().default(""),
  /** solo | team | bundle */
  tier: varchar("tier", { length: 16 }).notNull(),
  /** Amount paid in AUD cents (e.g. 2500 = $25.00) */
  amountCents: int("amount_cents").notNull(),
  /** The licence key assigned to this purchase */
  licenceKeyId: int("licence_key_id"),
  /** pending | delivered | failed */
  deliveryStatus: varchar("delivery_status", { length: 16 }).notNull().default("pending"),
  /** Error message if delivery failed */
  deliveryError: text("delivery_error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;
