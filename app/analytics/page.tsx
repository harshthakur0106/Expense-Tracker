"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, PiggyBank, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { InsightCard } from "@/components/InsightCard";
import { MonthlyChart } from "@/components/MonthlyChart";
import { SpendingChart } from "@/components/SpendingChart";
import {
  calculateInsights,
  calculateMonthlyTrend,
  calculateSpendingByCategory,
  formatCurrency,
} from "@/lib/calculations";
import { useTransactions } from "@/lib/storage";

export default function AnalyticsPage() {
  const { transactions } = useTransactions();

  const insights = useMemo(() => calculateInsights(transactions), [transactions]);
  const monthlyData = useMemo(() => calculateMonthlyTrend(transactions), [transactions]);
  const spendingData = useMemo(() => calculateSpendingByCategory(transactions), [transactions]);

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-5 text-slate-900 sm:px-4 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-sm text-slate-500">Financial Analysis</p>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Spending Insights</h1>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            title="Highest spending category"
            value={insights.highestCategory?.category ?? "N/A"}
            description={insights.highestCategory ? `${formatCurrency(insights.highestCategory.total)} in spending` : "No expense data yet."}
            icon={<BarChart3 size={18} />}
          />
          <InsightCard
            title="Average daily spend"
            value={formatCurrency(insights.averageDailySpending)}
            description="Calculated from recorded expense entries."
            icon={<PiggyBank size={18} />}
            accent="bg-emerald-100 text-emerald-700"
          />
          <InsightCard
            title="Estimated monthly spend"
            value={formatCurrency(insights.estimatedMonthlySpending)}
            description="Based on the current spending pattern."
            icon={<TrendingUp size={18} />}
            accent="bg-amber-100 text-amber-700"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Spending by category</h2>
            </div>
            <SpendingChart data={spendingData} />
            <div className="mt-4 space-y-3">
              {spendingData.map((item) => (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div
                      className="h-2.5 rounded-full bg-violet-500"
                      style={{ width: `${Math.min((item.value / (insights.totalExpenseAmount || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Monthly spending</h2>
            </div>
            <MonthlyChart data={monthlyData} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Detailed analysis</h2>
            <div className="space-y-4">
              {insights.categorySummary.map((category) => (
                <div key={category.category} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-slate-700">{category.category}</span>
                    <span className="text-sm text-slate-500">{category.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div
                      className="h-2.5 rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Smart suggestions</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-semibold text-slate-800">This month:</span> {formatCurrency(insights.totalExpenseAmount)} spent in total.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-semibold text-slate-800">Trend:</span> {insights.monthDifference >= 0 ? "Up" : "Down"} {Math.abs(insights.monthDifference).toFixed(1)}% vs last month.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="font-semibold text-slate-800">Focus:</span> {insights.highestCategory ? `${insights.highestCategory.category} is your biggest expense.` : "Add more expense data."}
              </li>
              {insights.recommendations.map((item) => (
                <li key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="font-semibold text-slate-800">{item.label}:</span> {item.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
