import {
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Vehicles stored in the recycler inventory.
 */
export const vehicles = pgTable("vehicles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  // Vehicle identification
  vin: text().notNull().unique(),

  year: integer().notNull(),
  make: text().notNull(),
  model: text().notNull(),

  // Vehicle information
  mileage: integer(),
  color: text(),
  engine: text(),
  transmission: text(),

  // Inventory information
  condition: text().notNull().default("pending"),
  yardLocation: text(),

  // Timestamps
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

/**
 * Parts removed from vehicles.
 */
export const parts = pgTable("parts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  // Which vehicle this part came from
  vehicleId: integer()
    .notNull()
    .references(() => vehicles.id, {
      onDelete: "cascade",
    }),

  // Part identification
  name: text().notNull(),
  partNumber: text(),

  // Inventory information
  category: text(),
  condition: text().notNull().default("used"),
  status: text().notNull().default("available"),

  // Pricing
  price: integer(),

  // Physical inventory location
  yardLocation: text(),

  // Timestamps
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

/**
 * Photos associated with a vehicle.
 *
 * The actual image is stored in Supabase Storage.
 * storagePath contains the path to that image.
 */
export const vehiclePhotos = pgTable("vehicle_photos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  vehicleId: integer()
    .notNull()
    .references(() => vehicles.id, {
      onDelete: "cascade",
    }),

  storagePath: text().notNull(),

  createdAt: timestamp().defaultNow().notNull(),
});

/**
 * Photos associated with a part.
 *
 * The actual image is stored in Supabase Storage.
 */
export const partPhotos = pgTable("part_photos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  partId: integer()
    .notNull()
    .references(() => parts.id, {
      onDelete: "cascade",
    }),

  storagePath: text().notNull(),

  createdAt: timestamp().defaultNow().notNull(),
});