import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fsDimension = Number(searchParams.get("fsDimension"));
        const displayCarton = searchParams.get("displayCarton");
        const width = Number(searchParams.get("width"));
        const bedoManu = searchParams.get("bedoManu");

        const filters: any = {};
        if (fsDimension) filters.fsDimension = Number(fsDimension);
        if (displayCarton) filters.displayCarton = displayCarton;
        if (width) filters.width = { gte: Number(width + 3)};
        if (bedoManu) filters.bedoManu = bedoManu;

        const bestUmkarton = await prisma.umkarton.findFirst({
            where: filters,
            include: {
                tierPrices: { include: { tier: true } }
            }
        });

        if (!bestUmkarton) {
            return NextResponse.json({
                "article": "This type of umkarton isn't available"
            }, { status: 200 });
        }

        return NextResponse.json(bestUmkarton);
    } catch (err) {
        console.error("Error finding umkarton:", err);
        return NextResponse.json({ error: "Failed to find umkarton" }, { status: 500 });
    }
}