import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({ categories: CATEGORIES });
}
