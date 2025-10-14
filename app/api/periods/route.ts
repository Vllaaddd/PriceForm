import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(){

    const periods = await prisma.period.findMany({
        include: {materials: true} 
    })

    return NextResponse.json(periods)

}