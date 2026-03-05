"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_CONFIG, type Category } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export function RecentExpenses() {
  const expenses = useExpenseStore((s) => s.expenses);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  const recent = expenses.slice(0, 8);

  const handleDelete = (id: string, note?: string) => {
    deleteExpense(id);
    toast.success(`Deleted expense${note ? `: ${note}` : ""}`);
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Expenses
        </CardTitle>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {recent.length > 0 ? (
          <div className="space-y-3">
            {recent.map((expense) => {
              const config = CATEGORY_CONFIG[expense.category as Category];
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">
                      {config.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {expense.note || config.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(expense.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        borderColor: config.color,
                        color: config.color,
                      }}
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
                      onClick={() => handleDelete(expense.id, expense.note)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Clock className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No expenses recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
