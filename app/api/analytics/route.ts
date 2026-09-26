import { NextResponse } from "next/server";
import { calculateInsights } from "@/lib/calculations";
import { seedTransactions } from "@/lib/seed-data";

export async function GET() {
  const analytics = calculateInsights(seedTransactions);

  return NextResponse.json({
    analytics,
    generatedAt: new Date().toISOString(),
  });
}
