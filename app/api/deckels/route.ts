import { prisma } from "@/prisma/prisma-client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(){

    const deckels = await prisma.deckel.findMany()

    return NextResponse.json(deckels)
}

export async function POST(req: NextRequest){

    try {
        const { article, price } = await req.json();

        const existingDeckel = await prisma.deckel.findFirst({
            where: { article: article }
        });

        if (existingDeckel) {
            return NextResponse.json({ message: "Deckel already exists", skipped: true }, { status: 200 });
        }

        const newCore = await prisma.deckel.create({
            data: {
                article,
                price: Number(price),
            }
        });

        return NextResponse.json(newCore, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating deckel" }, { status: 500 });
    }

}