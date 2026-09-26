import { NextResponse } from "next/server";
import { seedTransactions } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({
    transactions: seedTransactions,
    total: seedTransactions.length,
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload?.amount || Number(payload.amount) <= 0) {
      return NextResponse.json(
        { message: "Invalid transaction amount." },
        { status: 400 },
      );
    }

    const transaction = {
      id: `transaction-${Date.now()}`,
      date: payload.date ?? new Date().toISOString().slice(0, 10),
      type: payload.type ?? "Expense",
      category: payload.category ?? "Other",
      amount: Number(payload.amount),
      paymentMethod: payload.paymentMethod ?? "UPI",
      description: payload.description ?? "New transaction",
    };

    return NextResponse.json(
      { message: "Transaction created successfully.", transaction },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "The request body could not be parsed." },
      { status: 400 },
    );
  }
}
