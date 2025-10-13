import { prisma } from "@/prisma/prisma-client"
import { NextResponse } from "next/server"

export async function GET(){

    const cores = await prisma.core.findMany()

    return NextResponse.json(cores)
}