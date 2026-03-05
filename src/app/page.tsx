"use client";

import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { CategoryDonut } from "@/components/dashboard/CategoryDonut";
import { DailySpendChart } from "@/components/dashboard/DailySpendChart";
import { WeeklySpendChart } from "@/components/dashboard/WeeklySpendChart";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your spending overview for this month
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BudgetProgress />
        <StatsCards />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryDonut />
        <DailySpendChart />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4">
        <WeeklySpendChart />
      </div>

      {/* Recent list */}
      <RecentExpenses />
    </div>
  );
}
