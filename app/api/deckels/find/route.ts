import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const article = searchParams.get("article");

        const filters: any = {};
        if (article) filters.article = article;

        const bestDeckel = await prisma.deckel.findFirst({
            where: filters,
        });

        if (!bestDeckel) {
            return NextResponse.json({ "type": "No suitable deckel found", "price": 0 }, { status: 200 });
        }

        return NextResponse.json(bestDeckel);
    } catch (err) {
        console.error("Error finding deckel:", err);
        return NextResponse.json({ error: "Failed to find deckel" }, { status: 500 });
    }
}
