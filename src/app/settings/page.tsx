"use client";

import { useState, useEffect, useRef } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings2, Download, Upload, Save } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function SettingsPage() {
  const setBudget = useExpenseStore((s) => s.setBudget);
  const getThisMonthBudget = useExpenseStore((s) => s.getThisMonthBudget);
  const exportJSON = useExpenseStore((s) => s.exportJSON);
  const importJSON = useExpenseStore((s) => s.importJSON);
  const expenses = useExpenseStore((s) => s.expenses);
  const budgets = useExpenseStore((s) => s.budgets);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMonth = format(new Date(), "yyyy-MM");
  const currentBudget = getThisMonthBudget();

  const [budgetInput, setBudgetInput] = useState(
    currentBudget?.limit?.toString() ?? ""
  );

  // Sync if store hydrates after initial render
  useEffect(() => {
    if (currentBudget?.limit) {
      setBudgetInput(currentBudget.limit.toString());
    }
  }, [currentBudget?.limit]);

  const handleSaveBudget = () => {
    const parsed = parseFloat(budgetInput);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Enter a valid budget amount");
      return;
    }
    setBudget(currentMonth, parseFloat(parsed.toFixed(2)));
    toast.success(
      `Budget set to ${formatCurrency(parsed)} for ${format(new Date(), "MMMM yyyy")}`
    );
  };

  const handleExport = () => {
    if (expenses.length === 0 && budgets.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportJSON();
    toast.success("Data exported as JSON");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Please select a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importJSON(content);

        if (result.expenses === 0 && result.budgets === 0) {
          toast.info("No new data to import (all records already exist)");
        } else {
          toast.success(
            `Imported ${result.expenses} expense${result.expenses !== 1 ? "s" : ""} and ${result.budgets} budget${result.budgets !== 1 ? "s" : ""}`
          );
        }
      } catch {
        toast.error("Invalid JSON file. Make sure it's a SpendWise export.");
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be re-imported
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage budget and data
        </p>
      </div>

      {/* Monthly Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Set a spending limit for{" "}
            <strong>{format(new Date(), "MMMM yyyy")}</strong>
          </p>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Limit (USD)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1000.00"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="pl-7"
                />
              </div>
              <Button onClick={handleSaveBudget}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          {currentBudget && (
            <p className="text-xs text-muted-foreground">
              Current: {formatCurrency(currentBudget.limit)}
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Data Export & Import */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export or import your expenses and budget data as JSON.
          </p>

          {/* Current data stats */}
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm font-medium">{expenses.length} expenses</p>
            <p className="text-xs text-muted-foreground">
              {budgets.length} budget{budgets.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          {/* Export / Import buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleExport} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Importing merges data — duplicates are automatically skipped.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
