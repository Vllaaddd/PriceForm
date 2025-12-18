import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ article: string }> }){
    const { article } = await context.params
    const body = await req.json()

    try {
        const updated = await prisma.deckel.updateMany({
            where: { article },
            data: body,
        });

    
        if (updated.count === 0) {
            return NextResponse.json({
                message: `No deckel found with article ${article}`,
                skipped: true,
            });
        }

        return NextResponse.json({
            message: `Deckel ${article} updated successfully`,
            updated,
            skipped: false,
        });
  } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update deckel by article" }, { status: 500 });
    }
}