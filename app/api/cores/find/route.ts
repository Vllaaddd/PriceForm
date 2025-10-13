import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const length = Number(searchParams.get("length")) + 8;

        const filters: any = {};
        if (type) filters.type = type;
        if (length) filters.length = { gte: length };

        const bestCore = await prisma.core.findFirst({
            where: filters,
            orderBy: { length: "asc" },
        });

        if (!bestCore) {
            return NextResponse.json({ "type": "No suitable core found", "price": 0 }, { status: 200 });
        }

        return NextResponse.json(bestCore);
    } catch (err) {
        console.error("Error finding line:", err);
        return NextResponse.json({ error: "Failed to find line" }, { status: 500 });
    }
}
