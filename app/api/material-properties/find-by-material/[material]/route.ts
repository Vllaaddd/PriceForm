import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ material: string }> }) {
    const { material } = await context.params;

    try {
        const materialProperty = await prisma.materialProperty.findFirst({
            where: { material: material },
        });
        console.log("materialProperty", materialProperty?.density);

        if (!materialProperty) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(materialProperty);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error fetching material" }, { status: 500 });
    }
}