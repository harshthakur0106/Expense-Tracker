import type { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  accent?: string;
}

export function InsightCard({ title, value, description, icon, accent = "bg-violet-100 text-violet-700" }: InsightCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
