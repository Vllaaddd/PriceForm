import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const line = await prisma.line.findUnique({
            where: { id: Number(id) },
        });

        if (!line) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(line);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error fetching material" }, { status: 500 });
    }
}

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