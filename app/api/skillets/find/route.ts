import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const width = Number(searchParams.get("width"));
        const height = Number(searchParams.get("height"));
        const knife = searchParams.get("knife");
        const density = Number(searchParams.get("density"));

        const whereClause: any = {
            width: { gte: width },
            height: { gte: height + 3 },
        };

        if (knife) whereClause.knife = knife;
        if (density) whereClause.density = density;

        const bestSkillet = await prisma.skillet.findFirst({
            where: whereClause,
            orderBy: [
                { height: 'asc' },
                { width: 'asc' }
            ],
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