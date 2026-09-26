"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SpendingChartProps {
  data: Array<{ name: string; value: number }>;
}

const colors = ["#7c3aed", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#f97316", "#14b8a6"];

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.filter((item) => item.value > 0);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
            {chartData.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
              return `₹${numericValue.toLocaleString("en-IN")}`;
            }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
