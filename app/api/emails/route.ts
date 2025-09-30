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
        { label: "Title", value: calculation.title },
        { label: "Creator", value: calculation.creator },
        { label: "Roll", value: calculation.roll },
        { label: "Material", value: calculation.material },
        { label: "Material width", value: `${calculation.materialWidth} mm` },
        ...(calculation.material !== 'Baking paper' ? [
          { label: "Material thickness", value: `${calculation.materialThickness} mm` },
          { label: "Material length", value: `${calculation.materialLength} mm` },
        ] : []),
        { label: calculation.material === 'Baking paper' ? 'Paper color' : 'Material color', value: calculation.materialColor },
        ...(calculation.material === 'Baking paper' ? [
          { label: "Density", value: `${calculation.density} g/m²` },
          { label: "Type of product", value: calculation.typeOfProduct },
        ] : []),
        ...(calculation.typeOfProduct === 'Consumer sheets' ? [
          { label: "Sheet width", value: calculation.sheetWidth },
          { label: "Sheet length", value: calculation.sheetLength },
          { label: "Sheet quantity", value: calculation.sheetQuantity },
        ] : [
          { label: "Roll length", value: `${calculation.rollLength} m` },
        ]),
        { label: "Other properties", value: calculation.otherProperties },
        { label: "Skillet format", value: calculation.skilletFormat },
        { label: "Skillet knife", value: calculation.skilletKnife },
        calculation.roll === 'Catering' ? { label: "Lochstanzlinge", value: calculation.lochstanzlinge } : { label: "Skillet density", value: `${calculation.skilletDensity} g/m²` },
        { label: "Box type", value: calculation.boxType },
        { label: "Box color", value: calculation.boxColor },
        { label: "Box print", value: calculation.boxPrint },
        { label: "Box execution", value: calculation.boxExecution },
        { label: "Rolls per carton", value: calculation.rollsPerCarton },
        { label: "Antislide paper sheets", value: calculation.antislidePaperSheets },
        { label: "Carton per pallet", value: calculation.cartonPerPallet },
        { label: "Total order in rolls", value: calculation.totalOrderInRolls },
        { label: "Total order in pallets", value: calculation.totalOrderInPallets },
        { label: "Period", value: calculation.period },
        { label: "Delivery conditions", value: calculation.deliveryConditions },
        { label: "Delivery address", value: calculation.deliveryAddress },
        { label: "Reference article", value: calculation.referenceArticle },
        { label: "Remarks", value: calculation.remarks },
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
                Calculation: ${calculation.title}
            </h2>

            <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden;">
                <tbody>
                ${rows}
                </tbody>
            </table>
        </div>
    `

    await transporter.sendMail({
        from: `"Calculations" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Calulcation: ${calculation.title}`,
        html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Send email error:", err)
    return NextResponse.json({ error: "Не вдалося відправити email" }, { status: 500 })
  }
}
