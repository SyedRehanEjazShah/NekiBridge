import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const donorRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  city: z.string().min(1, "Please select a city"),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ngoRegisterSchema = z.object({
  // Admin info
  adminName: z.string().min(2, "Name must be at least 2 characters"),
  adminEmail: z.string().email("Please enter a valid email address"),
  adminPassword: z.string().min(6, "Password must be at least 6 characters"),
  adminPhone: z.string().optional(),
  // NGO info
  ngoName: z.string().min(2, "Organization name is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  registrationNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  city: z.string().min(1, "Please select a city"),
  address: z.string().min(5, "Address is required"),
});

export const donationItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  season: z.string().min(1, "Season is required"),
  condition: z.string().min(1, "Condition is required"),
  size: z.string().min(1, "Size is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").max(100),
  description: z.string().optional(),
});

export const createDonationSchema = z.object({
  ngoId: z.string().min(1, "Please select an NGO"),
  pickupMethod: z.enum(["DONOR_DROPOFF", "NGO_PICKUP", "COURIER"]),
  scheduledDate: z.string().optional(),
  scheduledTimeSlot: z.string().optional(),
  pickupAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(donationItemSchema).min(1, "Add at least one item"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const campaignSchema = z.object({
  title: z.string().min(3, "Title is required"),
  titleUrdu: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  targetItems: z.number().min(1),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  city: z.string().min(1, "City is required"),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  clothingNeeds: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type DonorRegisterInput = z.infer<typeof donorRegisterSchema>;
export type NgoRegisterInput = z.infer<typeof ngoRegisterSchema>;
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type DonationItemInput = z.infer<typeof donationItemSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
