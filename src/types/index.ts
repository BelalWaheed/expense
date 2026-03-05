export const CATEGORIES = [
  "food",
  "transport",
  "housing",
  "health",
  "entertainment",
  "shopping",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  note?: string;
  date: string; // "YYYY-MM-DD"
  createdAt: string; // ISO string
};

export type MonthlyBudget = {
  month: string; // "YYYY-MM"
  limit: number;
};

/** Centralized category metadata for colors & icons */
export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; emoji: string }
> = {
  food: { label: "Food", color: "#f97316", emoji: "🍔" },
  transport: { label: "Transport", color: "#3b82f6", emoji: "🚗" },
  housing: { label: "Housing", color: "#8b5cf6", emoji: "🏠" },
  health: { label: "Health", color: "#10b981", emoji: "💊" },
  entertainment: { label: "Entertainment", color: "#ec4899", emoji: "🎬" },
  shopping: { label: "Shopping", color: "#f59e0b", emoji: "🛍️" },
  other: { label: "Other", color: "#6b7280", emoji: "📦" },
};
