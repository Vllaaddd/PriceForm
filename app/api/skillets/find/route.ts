import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const format = Number(searchParams.get("format"));
        const knife = searchParams.get("knife");
        const density = Number(searchParams.get("density"));

        const filters: any = {};
        if (format) filters.format = format;
        if (knife) filters.knife = knife;
        if (density) filters.density = density;  

        const bestSkillet = await prisma.skillet.findFirst({
            where: filters,
            include: {
                tierPrices: { include: { tier: true } }
            }
        });

        if (!bestSkillet) {
            return NextResponse.json({
                "article": "This type of skillet isn't available"
            }, { status: 200 });
        }

        return NextResponse.json(bestSkillet);
    } catch (err) {
        console.error("Error finding skillet:", err);
        return NextResponse.json({ error: "Failed to find skillet" }, { status: 500 });
    }
}