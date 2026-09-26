"use client";

import { useEffect, useState } from "react";
import {
  CATEGORIES,
  PAYMENT_METHODS,
  type Category,
  type PaymentMethod,
  type Transaction,
  type TransactionType,
} from "@/lib/seed-data";

export interface TransactionFormValues {
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
}

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (values: TransactionFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const emptyForm: TransactionFormValues = {
  type: "Expense",
  amount: 0,
  category: "Food",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "UPI",
};

export function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Transaction",
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormValues>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description,
        date: initialData.date,
        paymentMethod: initialData.paymentMethod,
      });
      return;
    }

    setFormData(emptyForm);
  }, [initialData]);

  function updateField<Key extends keyof TransactionFormValues>(field: Key, value: TransactionFormValues[Key]) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.description.trim()) {
      window.alert("Please enter a description.");
      return;
    }

    if (!formData.date) {
      window.alert("Please select a valid date.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      window.alert("Amount must be greater than zero.");
      return;
    }

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      description: formData.description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Transaction type</span>
          <select
            value={formData.type}
            onChange={(event) => updateField("type", event.target.value as TransactionType)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none ring-0 transition focus:border-violet-500"
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Amount</span>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.amount}
            onChange={(event) => updateField("amount", Number(event.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-violet-500"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Category</span>
          <select
            value={formData.category}
            onChange={(event) => updateField("category", event.target.value as Category)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-violet-500"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Date</span>
          <input
            type="date"
            value={formData.date}
            onChange={(event) => updateField("date", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-violet-500"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
          <span>Description</span>
          <input
            type="text"
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Example: Grocery shopping"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-violet-500"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
          <span>Payment method</span>
          <select
            value={formData.paymentMethod}
            onChange={(event) => updateField("paymentMethod", event.target.value as PaymentMethod)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-violet-500"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 sm:w-auto"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
