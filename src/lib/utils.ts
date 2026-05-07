import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `NB-${year}-${random}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    PICKED_UP: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    IN_TRANSIT: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    RECEIVED: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    SORTED: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    DISTRIBUTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Bahawalpur", "Sargodha", "Abbottabad", "Mardan",
  "Sukkur", "Larkana", "Swat", "Muzaffarabad", "Gilgit",
] as const;

export const CLOTHING_CATEGORIES = [
  { value: "MENS", label: "Men's", labelUrdu: "مردانہ" },
  { value: "WOMENS", label: "Women's", labelUrdu: "زنانہ" },
  { value: "KIDS_BOYS", label: "Boys", labelUrdu: "لڑکے" },
  { value: "KIDS_GIRLS", label: "Girls", labelUrdu: "لڑکیاں" },
  { value: "INFANT", label: "Infant", labelUrdu: "شیرخوار" },
  { value: "UNISEX", label: "Unisex", labelUrdu: "مشترکہ" },
] as const;

export const CLOTHING_TYPES = [
  { value: "SHIRT", label: "Shirt", labelUrdu: "قمیض" },
  { value: "PANTS", label: "Pants/Trousers", labelUrdu: "پتلون" },
  { value: "SHALWAR_KAMEEZ", label: "Shalwar Kameez", labelUrdu: "شلوار قمیض" },
  { value: "DUPATTA", label: "Dupatta/Scarf", labelUrdu: "دوپٹہ" },
  { value: "JACKET", label: "Jacket", labelUrdu: "جیکٹ" },
  { value: "SWEATER", label: "Sweater", labelUrdu: "سویٹر" },
  { value: "SHAWL", label: "Shawl/Chadar", labelUrdu: "شال/چادر" },
  { value: "BLANKET", label: "Blanket", labelUrdu: "کمبل" },
  { value: "SHOES", label: "Shoes/Footwear", labelUrdu: "جوتے" },
  { value: "OTHER", label: "Other", labelUrdu: "دیگر" },
] as const;

export const CLOTHING_SEASONS = [
  { value: "SUMMER", label: "Summer", labelUrdu: "گرمی" },
  { value: "WINTER", label: "Winter", labelUrdu: "سردی" },
  { value: "ALL_SEASON", label: "All Season", labelUrdu: "ہر موسم" },
] as const;

export const CLOTHING_CONDITIONS = [
  { value: "NEW", label: "New (with tags)", labelUrdu: "نیا" },
  { value: "LIKE_NEW", label: "Like New", labelUrdu: "نئے جیسا" },
  { value: "GOOD", label: "Good", labelUrdu: "اچھا" },
  { value: "FAIR", label: "Fair", labelUrdu: "ٹھیک" },
] as const;

export const CLOTHING_SIZES = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "FREE_SIZE", label: "Free Size" },
] as const;

export const DONATION_STATUSES = [
  { value: "PENDING", label: "Pending", icon: "clock", step: 1 },
  { value: "SCHEDULED", label: "Scheduled", icon: "calendar", step: 2 },
  { value: "PICKED_UP", label: "Picked Up", icon: "truck", step: 3 },
  { value: "IN_TRANSIT", label: "In Transit", icon: "navigation", step: 4 },
  { value: "RECEIVED", label: "Received", icon: "package-check", step: 5 },
  { value: "SORTED", label: "Sorted", icon: "list-checks", step: 6 },
  { value: "DISTRIBUTED", label: "Distributed", icon: "heart-handshake", step: 7 },
] as const;
