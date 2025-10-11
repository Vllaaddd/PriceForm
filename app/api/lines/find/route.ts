import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const material = searchParams.get("material");
        const lineType = searchParams.get("lineType");
        const length = Number(searchParams.get("length"));

        const filters: any = {};
        if (material) filters.materialType = material;
        if (lineType) filters.lineType = lineType;
        if (length) filters.length = { gte: length };

        const bestLine = await prisma.line.findFirst({
            where: filters,
            orderBy: { length: "asc" },
        });

        if (!bestLine) {
            return NextResponse.json({ error: "No suitable line found" }, { status: 404 });
        }

        return NextResponse.json(bestLine);
    } catch (err) {
        console.error("Error finding line:", err);
        return NextResponse.json({ error: "Failed to find line" }, { status: 500 });
    }
}
