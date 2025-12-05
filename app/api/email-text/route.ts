import { prisma } from "@/prisma/prisma-client"
import { NextResponse } from "next/server"

export async function GET(){
    try {
        
        const text = await prisma.emailText.findFirst()

        return NextResponse.json(text)

    } catch (error) {
        console.error("Failed to fetch email text", error)
    }

}