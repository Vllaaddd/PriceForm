import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){

    const calucaltions = await prisma.calculation.findMany()

    return NextResponse.json(calucaltions)
}

export async function POST(req: NextRequest){
    const data = await req.json()

    const calculation = await prisma.calculation.create({
        data
    })

    return NextResponse.json(calculation)
}

export async function DELETE(){

    const calculation = await prisma.calculation.deleteMany()

    return NextResponse.json(calculation)
}