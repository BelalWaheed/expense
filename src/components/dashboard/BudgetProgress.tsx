"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

export function BudgetProgress() {
  const getThisMonthTotal = useExpenseStore((s) => s.getThisMonthTotal);
  const getThisMonthBudget = useExpenseStore((s) => s.getThisMonthBudget);

  const total = getThisMonthTotal();
  const budget = getThisMonthBudget();
  const limit = budget?.limit ?? 0;
  const percentage = limit > 0 ? Math.min((total / limit) * 100, 100) : 0;
  const isOverBudget = limit > 0 && total > limit;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Monthly Budget
        </CardTitle>
        <Target className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {limit > 0 ? (
          <>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-2xl font-bold">
                {formatCurrency(total)}
              </span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(limit)}
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
            />
            {isOverBudget && (
              <p className="text-xs text-destructive mt-2 font-medium">
                Over budget by {formatCurrency(total - limit)}
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-2xl font-bold">{formatCurrency(total)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              No budget set — go to Settings
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
