"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  CircleDollarSign,
  IndianRupee,
  Plus,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { MonthlyChart } from "@/components/MonthlyChart";
import { SpendingChart } from "@/components/SpendingChart";
import { TransactionForm, type TransactionFormValues } from "@/components/TransactionForm";
import {
  calculateCategoryBreakdown,
  calculateDashboardStats,
  calculateInsights,
  calculateMonthlyTrend,
  formatCurrency,
} from "@/lib/calculations";
import { type Transaction } from "@/lib/seed-data";
import { useTransactions } from "@/lib/storage";

export default function Home() {
  const { transactions, setTransactions } = useTransactions();
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => calculateDashboardStats(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(transactions), [transactions]);
  const monthlyTrend = useMemo(() => calculateMonthlyTrend(transactions), [transactions]);
  const insights = useMemo(() => calculateInsights(transactions), [transactions]);

  function handleAddTransaction(values: TransactionFormValues) {
    const nextTransaction: Transaction = {
      id: `local-${Date.now()}`,
      date: values.date,
      type: values.type,
      category: values.category,
      amount: Number(values.amount),
      paymentMethod: values.paymentMethod,
      description: values.description,
    };

    setTransactions((current) => [nextTransaction, ...current]);
    setShowForm(false);
  }

  const topCategory = categoryBreakdown[0];
  const currentMonthTrend = monthlyTrend[monthlyTrend.length - 1]?.total ?? 0;

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-5 text-slate-900 sm:px-4 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-600">SpendWise</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Personal Expense Tracker</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/transactions" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto">
              Transactions
            </Link>
            <Link href="/analytics" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto">
              Analytics
            </Link>
            <button
              type="button"
              onClick={() => setShowForm((current) => !current)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 sm:w-auto"
            >
              <Plus size={16} />
              Add expense
            </button>
          </div>
        </header>

        {showForm ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Add a new transaction</h2>
            <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowForm(false)} />
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total income"
            value={formatCurrency(stats.totalIncome)}
            icon={<BadgeDollarSign size={18} />}
            accent="bg-emerald-100 text-emerald-700"
          />
          <DashboardCard
            title="Total expenses"
            value={formatCurrency(stats.totalExpenses)}
            icon={<ReceiptText size={18} />}
            accent="bg-rose-100 text-rose-700"
          />
          <DashboardCard
            title="Current balance"
            value={formatCurrency(stats.currentBalance)}
            icon={<CircleDollarSign size={18} />}
            accent="bg-violet-100 text-violet-700"
          />
          <DashboardCard
            title="Transactions"
            value={String(stats.totalTransactions)}
            subtitle="Across all tracked entries"
            icon={<IndianRupee size={18} />}
            accent="bg-amber-100 text-amber-700"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-slate-900">Category-wise spending</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                <BarChart3 size={14} />
                {formatCurrency(currentMonthTrend)} this month
              </span>
            </div>
            <SpendingChart data={categoryBreakdown.map((item) => ({ name: item.category, value: item.total }))} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-slate-900">Monthly spending</h2>
              <span className="text-sm text-slate-500">3-month overview</span>
            </div>
            <MonthlyChart data={monthlyTrend} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent transactions</h2>
              <Link href="/transactions" className="inline-flex items-center gap-1 text-sm font-medium text-violet-600">
                View all <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{transaction.description}</p>
                    <p className="text-xs text-slate-500">
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className={`font-semibold ${transaction.type === "Expense" ? "text-rose-600" : "text-emerald-600"}`}>
                      {transaction.type === "Expense" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-slate-500">{transaction.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="text-violet-600" size={18} />
              <h2 className="text-xl font-bold text-slate-900">Spending insights</h2>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-xl bg-violet-50 p-3">
                <p className="font-semibold text-violet-700">This Month</p>
                <p className="mt-2 font-medium text-slate-800">{topCategory ? topCategory.category : "No data"}</p>
                <p className="text-xs text-slate-500">{topCategory ? formatCurrency(topCategory.total) : "₹0"}</p>
              </div>

              <ul className="space-y-2 leading-6">
                <li>
                  • {topCategory ? `${topCategory.category} is your highest expense category.` : "Add expense entries to unlock insights."}
                </li>
                <li>
                  • Your spending changed by {Math.abs(insights.monthDifference).toFixed(1)}% compared with last month.
                </li>
                <li>
                  • Estimated monthly spend is {formatCurrency(insights.estimatedMonthlySpending)} based on the current spending pattern.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
