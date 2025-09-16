import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params; // без await

  try {
    const calculation = await prisma.calculation.findUnique({
      where: { id: Number(id) },
    });

    if (!calculation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(calculation);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching calculation" }, { status: 500 });
  }
}
