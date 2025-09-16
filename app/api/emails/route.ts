import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { email, calculation } = await req.json()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const fields = [
        { label: "Назва", value: calculation.title },
        { label: "Матеріал", value: calculation.material },
        { label: "Ширина матеріалу", value: `${calculation.materialWidth} мм` },
        { label: "Товщина матеріалу", value: `${calculation.materialThickness} мм` },
        { label: "Довжина матеріалу", value: `${calculation.materialLength} мм` },
        { label: "Колір матеріалу", value: calculation.materialColor },
        { label: "Інші властивості", value: calculation.otherProperties },
        { label: "Skillet format", value: calculation.skilletFormat },
        { label: "Skillet knife", value: calculation.skilletKnife },
        { label: "Skillet density", value: `${calculation.skilletDensity} г/м²` },
        { label: "Тип коробки", value: calculation.boxType },
        { label: "Колір коробки", value: calculation.boxColor },
        { label: "Друк коробки", value: calculation.boxPrint },
        { label: "Execution коробки", value: calculation.boxExecution },
        { label: "Rolls per carton", value: calculation.rollsPerCarton },
        { label: "Antislide paper sheets", value: calculation.antislidePaperSheets },
        { label: "Carton per pallet", value: calculation.cartonPerPallet },
        { label: "Total order in rolls", value: calculation.totalOrderInRolls },
        { label: "Total order in pallets", value: calculation.totalOrderInPallets },
        { label: "Період", value: calculation.period },
        { label: "Умови доставки", value: calculation.deliveryConditions },
        { label: "Адреса доставки", value: calculation.deliveryAddress },
        { label: "Reference article", value: calculation.referenceArticle },
        { label: "Примітки", value: calculation.remarks },
    ]

    const rows = fields
        .map(
            (field) => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; background:#f3f4f6; font-weight:600;">
                    ${field.label}
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                    ${field.value ?? "-"}
                    </td>
                </tr>
            `
        )
        .join("")

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb; color: #333;">
            <h2 style="text-align: center; color: #2563eb; margin-bottom:20px;">
                Розрахунок: ${calculation.title}
            </h2>

            <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden;">
                <tbody>
                ${rows}
                </tbody>
            </table>
        </div>
    `

    await transporter.sendMail({
        from: `"Розрахунки" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Розрахунок: ${calculation.title}`,
        html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Send email error:", err)
    return NextResponse.json({ error: "Не вдалося відправити email" }, { status: 500 })
  }
}
