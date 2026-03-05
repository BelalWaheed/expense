"use client";

import { formatCurrency } from "@/lib/utils";
import { CATEGORY_CONFIG, type Category, type Expense } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No expenses match your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => {
        const config = CATEGORY_CONFIG[expense.category as Category];
        return (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg shrink-0">{config.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {expense.note || config.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(expense.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Badge
                variant="secondary"
                className="text-xs hidden sm:inline-flex"
                style={{ borderColor: config.color, color: config.color }}
              >
                {config.label}
              </Badge>
              <span className="text-sm font-semibold w-20 text-right">
                {formatCurrency(expense.amount)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={() => onDelete(expense.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
