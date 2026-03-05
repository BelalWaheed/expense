"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CalendarDays } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  isSameDay,
  subWeeks,
} from "date-fns";

export function WeeklySpendChart() {
  const expenses = useExpenseStore((s) => s.expenses);

  // Current week + last 3 weeks = 4 weeks of data
  const now = new Date();
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(now, 3 - i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(now, 3 - i), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const total = expenses
      .filter((e) => {
        const expDate = parseISO(e.date);
        return days.some((d) => isSameDay(d, expDate));
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const label =
      i === 3
        ? "This Week"
        : i === 2
          ? "Last Week"
          : `${format(weekStart, "MMM d")}`;

    return {
      week: label,
      amount: total,
      range: `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d")}`,
    };
  });

  const hasData = weeks.some((w) => w.amount > 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Weekly Spending
        </CardTitle>
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks} barSize={32}>
                <defs>
                  <linearGradient
                    id="weeklyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Spent",
                  ]}
                  labelFormatter={(_, payload) => {
                    if (payload && payload.length > 0) {
                      return (
                        payload[0]?.payload?.range ?? ""
                      );
                    }
                    return "";
                  }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--card-foreground))",
                  }}
                  cursor={{ fill: "hsl(var(--accent))", opacity: 0.3 }}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#weeklyGradient)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CalendarDays className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No weekly data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
