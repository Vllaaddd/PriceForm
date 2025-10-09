import { prisma } from "@/prisma/prisma-client"
import { NextResponse } from "next/server"

export async function GET(){

    const lines = await prisma.line.findMany()

    return NextResponse.json(lines)
}