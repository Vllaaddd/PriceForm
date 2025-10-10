import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const updatedProperty = await prisma.materialProperty.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updatedProperty);
  } catch (err) {
    console.error("Error updating property:", err);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}