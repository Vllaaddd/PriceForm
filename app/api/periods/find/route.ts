import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period");
        const material = searchParams.get("material");

        const filters: any = {};
        if (period) filters.period = period;

        const materialData = await prisma.materialProperty.findFirst({
            where: {
                material: String(material),
                period: { period: String(period) },
            },
            include: { period: true },
        });

        if (!materialData) {
            return NextResponse.json({ error: "No suitable line found" }, { status: 404 });
        }

        return NextResponse.json(materialData);
    } catch (err) {
        console.error("Error finding line:", err);
        return NextResponse.json({ error: "Failed to find line" }, { status: 500 });
    }
}
