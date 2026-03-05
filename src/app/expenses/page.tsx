"use client";

import { useMemo, useState } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { Receipt, PlusCircle } from "lucide-react";
import { parseISO, isWithinInterval } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

export default function ExpensesPage() {
  const expenses = useExpenseStore((s) => s.expenses);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (category !== "all" && e.category !== category) return false;

      if (dateFrom || dateTo) {
        const expDate = parseISO(e.date);
        const start = dateFrom ? parseISO(dateFrom) : new Date(0);
        const end = dateTo ? parseISO(dateTo) : new Date("2099-12-31");
        if (!isWithinInterval(expDate, { start, end })) return false;
      }

      return true;
    });
  }, [expenses, category, dateFrom, dateTo]);

  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast.success("Expense deleted");
  };

  const clearFilters = () => {
    setCategory("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} expense{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button asChild>
          <Link href="/expenses/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              All Expenses
            </CardTitle>
          </div>
          <ExpenseFilters
            category={category}
            onCategoryChange={setCategory}
            dateFrom={dateFrom}
            onDateFromChange={setDateFrom}
            dateTo={dateTo}
            onDateToChange={setDateTo}
            onClear={clearFilters}
          />
        </CardHeader>
        <CardContent>
          <ExpenseTable expenses={filtered} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
