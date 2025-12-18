import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }){

    const { id } = await context.params
    const data = await req.json()

    try {
        const updatedDeckel = await prisma.deckel.update({
            where: { id: Number(id) },
            data,
        });

        return NextResponse.json(updatedDeckel);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error updating deckel" }, { status: 500 });
    }

}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }){
    const { id } = await context.params;

    try {
        const deckel = await prisma.deckel.delete({
            where: { id: Number(id) },
        });

        if (!deckel) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(deckel);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error deleting deckel" }, { status: 500 });
    }
}