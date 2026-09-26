"use client";

import Link from "next/link";
import { ArrowLeft, CircleDollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { TransactionForm, type TransactionFormValues } from "@/components/TransactionForm";
import { TransactionTable } from "@/components/TransactionTable";
import { formatCurrency } from "@/lib/calculations";
import { type Transaction } from "@/lib/seed-data";
import { useTransactions } from "@/lib/storage";

export default function TransactionsPage() {
  const { transactions, setTransactions } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  function handleSubmit(values: TransactionFormValues) {
    if (editingTransaction) {
      setTransactions((current) =>
        current.map((item) =>
          item.id === editingTransaction.id
            ? {
                ...item,
                ...values,
                amount: Number(values.amount),
                category: values.category,
                date: values.date,
                description: values.description,
                paymentMethod: values.paymentMethod,
                type: values.type,
              }
            : item,
        ),
      );
      setEditingTransaction(undefined);
      setIsFormOpen(false);
      return;
    }

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
    setIsFormOpen(false);
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  function handleDelete(id: string) {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }

  const totalAmount = transactions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-5 text-slate-900 sm:px-4 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-sm text-slate-500">Transactions</p>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">History & management</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingTransaction(undefined);
              setIsFormOpen((current) => !current);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 md:w-auto"
          >
            <Plus size={16} />
            Add transaction
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <CircleDollarSign size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Transactions</p>
                <h3 className="text-xl font-bold text-slate-900">{transactions.length}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <p className="text-sm text-slate-500">Total tracked value</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(totalAmount)}</h3>
          </div>
        </div>

        {isFormOpen ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingTransaction ? "Edit transaction" : "Add a new transaction"}
              </h2>
            </div>
            <TransactionForm
              initialData={editingTransaction}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTransaction(undefined);
              }}
              submitLabel={editingTransaction ? "Save changes" : "Add Transaction"}
            />
          </div>
        ) : null}

        <TransactionTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
