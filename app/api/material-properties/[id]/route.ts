import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const materialProperty = await prisma.materialProperty.findUnique({
            where: { id: Number(id) },
        });

        if (!materialProperty) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(materialProperty);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error fetching material" }, { status: 500 });
    }
}

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