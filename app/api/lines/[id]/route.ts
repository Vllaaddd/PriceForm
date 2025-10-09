import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const updatedLine = await prisma.line.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updatedLine);
  } catch (err) {
    console.error("Error updating line:", err);
    return NextResponse.json({ error: "Failed to update line" }, { status: 500 });
  }
}