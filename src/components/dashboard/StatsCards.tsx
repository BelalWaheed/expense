"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingDown, Receipt } from "lucide-react";

export function StatsCards() {
  const getThisMonthExpenses = useExpenseStore((s) => s.getThisMonthExpenses);
  const getThisMonthTotal = useExpenseStore((s) => s.getThisMonthTotal);

  const monthExpenses = getThisMonthExpenses();
  const total = getThisMonthTotal();
  const count = monthExpenses.length;
  const avgPerExpense = count > 0 ? total / count : 0;

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(total),
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Transactions",
      value: count.toString(),
      icon: Receipt,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Avg / Expense",
      value: formatCurrency(avgPerExpense),
      icon: TrendingDown,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
