import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const material = searchParams.get("material");
        const lineType = searchParams.get("lineType");
        const length = Number(searchParams.get("length"));
        const width = Number(searchParams.get("width"));

        const filters: any = {};
        if (material) filters.material = material === 'PVC' ? 'Clingfilm' : material === 'PE' ? 'Clingfilm' : material;
        if (lineType) filters.lineType = lineType;
        if (length) filters.maxLength = { gte: length };
        if (width) filters.maxWidth = { gte: width };

        const bestLine = await prisma.line.findFirst({
            where: filters,
            orderBy: { maxLength: "asc" },
        });

        if (!bestLine) {
            return NextResponse.json({ price: 0 }, { status: 200 });
        }

        return NextResponse.json(bestLine);
    } catch (err) {
        console.error("Error finding line:", err);
        return NextResponse.json({ error: "Failed to find line" }, { status: 500 });
    }
}