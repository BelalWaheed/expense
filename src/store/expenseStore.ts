import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { CATEGORIES, type Expense, type MonthlyBudget, type Category } from "@/types";

interface ExpenseState {
  expenses: Expense[];
  budgets: MonthlyBudget[];

  // Actions
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
  deleteExpense: (id: string) => void;
  setBudget: (month: string, limit: number) => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => { expenses: number; budgets: number };

  // Selectors
  getThisMonthExpenses: () => Expense[];
  getThisMonthTotal: () => number;
  getThisMonthBudget: () => MonthlyBudget | undefined;
  getByCategory: (category: Category) => Expense[];
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      budgets: [],

      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },

      setBudget: (month, limit) => {
        set((state) => {
          const existing = state.budgets.findIndex((b) => b.month === month);
          if (existing >= 0) {
            const updated = [...state.budgets];
            updated[existing] = { month, limit };
            return { budgets: updated };
          }
          return { budgets: [...state.budgets, { month, limit }] };
        });
      },

      exportJSON: () => {
        const { expenses, budgets } = get();
        const data = JSON.stringify({ expenses, budgets }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `expenses-backup-${format(new Date(), "yyyy-MM-dd")}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      getThisMonthExpenses: () => {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        return get().expenses.filter((e) =>
          isWithinInterval(parseISO(e.date), { start, end })
        );
      },

      getThisMonthTotal: () => {
        return get()
          .getThisMonthExpenses()
          .reduce((sum, e) => sum + e.amount, 0);
      },

      getThisMonthBudget: () => {
        const currentMonth = format(new Date(), "yyyy-MM");
        return get().budgets.find((b) => b.month === currentMonth);
      },

      getByCategory: (category) => {
        return get().expenses.filter((e) => e.category === category);
      },

      importJSON: (jsonString: string) => {
        try {
          const data = JSON.parse(jsonString);
          let importedExpenses = 0;
          let importedBudgets = 0;

          if (data.expenses && Array.isArray(data.expenses)) {
            const validExpenses = data.expenses.filter(
              (e: Record<string, unknown>) =>
                typeof e.id === "string" &&
                typeof e.amount === "number" &&
                typeof e.category === "string" &&
                CATEGORIES.includes(e.category as Category) &&
                typeof e.date === "string"
            ) as Expense[];

            const existingIds = new Set(get().expenses.map((e) => e.id));
            const newExpenses = validExpenses.filter(
              (e) => !existingIds.has(e.id)
            );

            if (newExpenses.length > 0) {
              set((state) => ({
                expenses: [...newExpenses, ...state.expenses],
              }));
              importedExpenses = newExpenses.length;
            }
          }

          if (data.budgets && Array.isArray(data.budgets)) {
            const validBudgets = data.budgets.filter(
              (b: Record<string, unknown>) =>
                typeof b.month === "string" &&
                typeof b.limit === "number" &&
                /^\d{4}-\d{2}$/.test(b.month as string)
            ) as MonthlyBudget[];

            const existingMonths = new Set(get().budgets.map((b) => b.month));
            const newBudgets = validBudgets.filter(
              (b) => !existingMonths.has(b.month)
            );

            if (newBudgets.length > 0) {
              set((state) => ({
                budgets: [...state.budgets, ...newBudgets],
              }));
              importedBudgets = newBudgets.length;
            }
          }

          return { expenses: importedExpenses, budgets: importedBudgets };
        } catch {
          throw new Error("Invalid JSON file");
        }
      },
    }),
    {
      name: "expense-tracker-storage",
    }
  )
);
