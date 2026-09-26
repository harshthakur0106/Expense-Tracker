import { CATEGORIES, type Category, type Transaction } from "@/lib/seed-data";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getMonthLabel(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export function getCurrentMonthTransactions(transactions: Transaction[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return transactions.filter((transaction) => {
    const expenseDate = new Date(`${transaction.date}T00:00:00`);
    return (
      expenseDate.getFullYear() === currentYear &&
      expenseDate.getMonth() === currentMonth
    );
  });
}

export function calculateDashboardStats(transactions: Transaction[]) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const currentMonthExpenses = getCurrentMonthTransactions(
    transactions.filter((item) => item.type === "Expense"),
  ).reduce((sum, item) => sum + item.amount, 0);

  const recentTransactions = [...transactions]
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    currentBalance: totalIncome - totalExpenses,
    totalTransactions: transactions.length,
    currentMonthExpenses,
    recentTransactions,
  };
}

export function calculateCategoryBreakdown(transactions: Transaction[]) {
  const expenses = transactions.filter((transaction) => transaction.type === "Expense");
  const totalExpenseAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  const breakdown = CATEGORIES.map((category) => {
    const total = expenses
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      category,
      total,
      percentage: totalExpenseAmount > 0 ? (total / totalExpenseAmount) * 100 : 0,
    };
  }).filter((item) => item.total > 0);

  return breakdown.sort((left, right) => right.total - left.total);
}

export function calculateMonthlyTrend(transactions: Transaction[]) {
  const monthMap = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === "Expense")
    .forEach((transaction) => {
      const date = new Date(`${transaction.date}T00:00:00`);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(monthKey, (monthMap.get(monthKey) ?? 0) + transaction.amount);
    });

  return Array.from(monthMap.entries())
    .map(([key, total]) => {
      const [year, month] = key.split("-");
      const value = new Date(Number(year), Number(month) - 1, 1);
      return {
        month: value.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        total,
      };
    })
    .sort((left, right) => new Date(left.month).getTime() - new Date(right.month).getTime());
}

export function calculateInsights(transactions: Transaction[]) {
  const expenses = transactions.filter((transaction) => transaction.type === "Expense");
  const totalExpenseAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const breakdown = calculateCategoryBreakdown(transactions);
  const highestCategory = breakdown[0];

  const currentMonth = getCurrentMonthTransactions(expenses);
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

  const previousMonthYear = previousMonthDate.getFullYear();
  const previousMonthIndex = previousMonthDate.getMonth();

  const currentMonthAmount = currentMonth.reduce((sum, item) => sum + item.amount, 0);
  const previousMonthAmount = expenses
    .filter((item) => {
      const date = new Date(`${item.date}T00:00:00`);
      return (
        date.getFullYear() === previousMonthYear &&
        date.getMonth() === previousMonthIndex
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const monthDifference = previousMonthAmount === 0 ? 0 : ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100;
  const averageDailySpending = expenses.length > 0 ? totalExpenseAmount / Math.max(1, new Set(expenses.map((item) => item.date)).size) : 0;
  const estimatedMonthlySpending = currentMonthAmount > 0 ? currentMonthAmount * 1.18 : 0;

  const recommendations = [
    {
      label: "Food",
      message: "Keep dining out below 25% of your monthly spending to maintain balance.",
      threshold: 0.25,
    },
    {
      label: "Shopping",
      message: "Avoid impulsive purchases above ₹1,500 per week.",
      threshold: 0.15,
    },
    {
      label: "Travel",
      message: "Try to keep commute spending within your monthly travel cap.",
      threshold: 0.12,
    },
  ];

  const categorySummary = breakdown.map((item) => ({
    ...item,
    share: totalExpenseAmount > 0 ? (item.total / totalExpenseAmount) * 100 : 0,
  }));

  return {
    highestCategory,
    categorySummary,
    monthDifference,
    averageDailySpending,
    estimatedMonthlySpending,
    totalExpenseAmount,
    recommendations,
  };
}

export function buildMonthComparison(transactions: Transaction[]) {
  const monthlyData = calculateMonthlyTrend(transactions);
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2] ?? { total: 0 };

  return {
    currentMonth: currentMonth?.total ?? 0,
    previousMonth: previousMonth.total ?? 0,
    changePercent: previousMonth.total
      ? ((currentMonth?.total ?? 0 - previousMonth.total) / previousMonth.total) * 100
      : 0,
  };
}

export function calculateSpendingByCategory(transactions: Transaction[]) {
  return calculateCategoryBreakdown(transactions).map((item) => ({
    name: item.category,
    value: item.total,
  }));
}

export function getAvailableCategories(): Category[] {
  return [...CATEGORIES];
}
