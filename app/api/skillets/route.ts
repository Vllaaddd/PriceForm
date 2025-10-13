import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(){

    const skillets = await prisma.skillet.findMany()

    return NextResponse.json(skillets)
}