export const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
] as const;

export const PAYMENT_METHODS = ["UPI", "Cash", "Card", "Net Banking"] as const;

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type TransactionType = "Income" | "Expense";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: Category;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
}

const expenseDescriptions: Record<Category, string[]> = {
  Food: ["Groceries", "Lunch", "Snacks", "Cafe", "Dinner", "Milk", "Breakfast"],
  Travel: ["Fuel", "Metro", "Ride", "Train", "Taxi", "Bus", "Parking"],
  Shopping: ["Essentials", "Clothes", "Gadgets", "Stationery", "Home Items", "Accessories"],
  Education: ["Books", "Course Fee", "Notebook", "Workshop", "Study Material", "Exam Fee"],
  Bills: ["Rent", "Internet", "Electricity", "Mobile Recharge", "Water", "Maintenance"],
  Entertainment: ["Movie", "Streaming", "Game", "Concert", "Party", "Event Tickets"],
  Health: ["Medicine", "Doctor Visit", "Fitness", "Pharmacy", "Checkup", "Supplements"],
  Other: ["Miscellaneous", "Household", "Unexpected Expense", "Gift", "Repair", "General"],
};

const incomeDescriptions = [
  "Salary",
  "Freelance Project",
  "Side Income",
  "Refund",
  "Bonus",
  "Gift",
  "Part-time Work",
];

function generateDailyDate(baseDate: Date, offset: number) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + offset);
  return nextDate;
}

export function createSeedTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const baseDate = new Date("2026-07-01");

  for (let index = 0; index < 320; index += 1) {
    const offset = (index * 7 + (index % 11) * 3) % 92;
    const currentDate = generateDailyDate(baseDate, offset);
    const isIncome = index % 9 === 0 || index % 17 === 0;

    if (isIncome) {
      const amount = 3500 + (index % 8) * 1400 + (index % 5) * 225;
      const paymentMethod = PAYMENT_METHODS[index % PAYMENT_METHODS.length];
      const description = incomeDescriptions[index % incomeDescriptions.length];

      transactions.push({
        id: `income-${index + 1}`,
        date: currentDate.toISOString().slice(0, 10),
        type: "Income",
        category: "Other",
        amount,
        paymentMethod,
        description,
      });

      continue;
    }

    const category = CATEGORIES[index % CATEGORIES.length];
    const amountVariation = 80 + (index % 6) * 50 + (index % 4) * 110;
    const baseAmount = category === "Bills" ? 900 : category === "Shopping" ? 1150 : category === "Travel" ? 460 : category === "Education" ? 540 : category === "Health" ? 390 : category === "Entertainment" ? 430 : category === "Food" ? 280 : 260;
    const amount = Math.round(baseAmount + amountVariation);
    const paymentMethod = PAYMENT_METHODS[(index + 1) % PAYMENT_METHODS.length];
    const description = expenseDescriptions[category][index % expenseDescriptions[category].length];

    transactions.push({
      id: `expense-${index + 1}`,
      date: currentDate.toISOString().slice(0, 10),
      type: "Expense",
      category,
      amount,
      paymentMethod,
      description,
    });
  }

  return transactions.sort(
    (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
  );
}

export const seedTransactions = createSeedTransactions();
