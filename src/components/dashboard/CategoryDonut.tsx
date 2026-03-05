"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_CONFIG, type Category } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChartIcon } from "lucide-react";

export function CategoryDonut() {
  const getThisMonthExpenses = useExpenseStore((s) => s.getThisMonthExpenses);
  const expenses = getThisMonthExpenses();

  // Group by category
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals)
    .map(([category, value]) => ({
      name: CATEGORY_CONFIG[category as Category].label,
      value,
      color: CATEGORY_CONFIG[category as Category].color,
    }))
    .sort((a, b) => b.value - a.value);

  const hasData = data.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          By Category
        </CardTitle>
        <PieChartIcon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {data.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-medium ml-2">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <PieChartIcon className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No expenses this month</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
