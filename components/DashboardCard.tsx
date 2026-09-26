import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  accent?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  accent = "bg-slate-100 text-slate-700",
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{value}</h3>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </div>
      </div>
      {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
