import { pgTable, text, serial, integer, boolean, jsonb, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from original project
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Location schema for Google Places data
export const locationSchema = z.object({
  placeId: z.string(),
  formattedAddress: z.string(),
  addressInput: z.string(),
  // Optional fields that might be used if we extend functionality
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type Location = z.infer<typeof locationSchema>;

// Quote Request schema
export const quoteRequestSchema = z.object({
  tripType: z.enum(["oneWay", "roundTrip"]),
  numPassengers: z.number().int().min(1).max(100),
  departureDate: z.string(),
  departureTime: z.string(),
  returnDate: z.string().optional(),
  pickupLocation: locationSchema,
  dropoffLocation: locationSchema,
  busType: z.enum(["standard", "luxury"]),
  amenities: z.array(z.string()).optional(),
  specialRequirements: z.string().optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

// Quote Response schema
export const quoteBreakdownItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  multiplier: z.number().optional(),
});

export type QuoteBreakdownItem = z.infer<typeof quoteBreakdownItemSchema>;

export const quoteResponseSchema = z.object({
  quoteId: z.string(),
  tripDetails: quoteRequestSchema,
  breakdown: z.array(quoteBreakdownItemSchema),
  subtotal: z.number(),
  serviceFee: z.number(),
  total: z.number(),
  createdAt: z.string(),
  expiresAt: z.string(),
});

export type QuoteResponse = z.infer<typeof quoteResponseSchema>;

// Bookings table (for future expansion)
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  quoteId: text("quote_id").notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  tripDetails: jsonb("trip_details").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
