'use client'

import { EmailModal } from "@/components/email-modal"
import { Info } from "@/components/info"
import { SectionHeader } from "@/components/section-header"
import { Api } from "@/services/api-client"
import { sendEmail } from "@/services/emails"
import { Calculation } from "@prisma/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

export default function Home() {
  const pathname = usePathname()
  const parts = pathname.split("/")
  const id = parts[parts.length - 1]

  const [calculation, setCalculation] = useState<Calculation | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchCalculations() {
      try {
        const calculation = await Api.calculations.getOneCalculation(id)
        setCalculation(calculation)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCalculations()
  }, [id])  

  return(
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {calculation ? (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            
            <div className="bg-blue-600 p-8 text-center text-white">
              <h1 className="text-3xl font-bold mb-2">{calculation.title}</h1>
              <p className="opacity-90">
                Created on {new Date(calculation.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-6 sm:p-10">
              
              <div className="hidden sm:grid sm:grid-cols-12 text-xs uppercase text-gray-400 font-bold tracking-wider mb-4 border-b pb-2 px-2">
                <div className="col-span-5">Description</div>
                <div className="col-span-3 text-center">Unit</div>
                <div className="col-span-4 text-right">Value</div>
              </div>

              <SectionHeader title="General Information" />
              <Info label="Creator" value={calculation.creator} />
              <Info label="Period" value={calculation.period} />
              <Info label="Delivery Conditions" value={calculation.deliveryConditions} />
              <Info label="Delivery Address" value={calculation.deliveryAddress} />
              <Info label="Reference Article" value={calculation.referenceArticle} />

              <SectionHeader title="Material Specifications" />
              <Info label="Roll Type" value={calculation.roll} />
              <Info label="Material" value={calculation.material} />
              <Info label="Material Color" value={calculation.materialColor} />
              <Info label="Width" unit="mm" value={calculation.materialWidth} />
              
              {calculation.material === "Baking paper" ? (
                <>
                  <Info label="Density" unit="g/m²" value={calculation.density} />
                  <Info label="Type of Product" value={calculation.typeOfProduct} />
                </>
              ) : (
                <>
                  <Info label="Length" unit="mm" value={calculation.materialLength} />
                  <Info label="Thickness" unit="mm" value={calculation.materialThickness} />
                </>
              )}

              <Info label="Other Properties" value={calculation.otherProperties} />

              {(calculation.typeOfProduct === 'Consumer sheets' && calculation.material === 'Baking paper') ? (
                <>
                  <Info label="Sheet Width" unit="m" value={calculation.sheetWidth} />
                  <Info label="Sheet Length" unit="m" value={calculation.sheetLength} />
                  <Info label="Sheet Quantity" unit="pcs" value={calculation.sheetQuantity} />
                </>
              ) : calculation.typeOfProduct === 'Consumer roll' ? (
                <Info label="Roll Length" unit="m" value={calculation.rollLength} />
              ) : null}

              <SectionHeader title="Packaging & Box" />
              {calculation.skilletKnife && <Info label="Skillet Knife" value={calculation.skilletKnife} />}
              
              {calculation.roll === 'Catering' ? (
                <Info label="Lochstanzlinge" value={calculation.lochstanzlinge} />
              ) : (
                <Info label="Skillet Density" unit="g/m²" value={calculation.skilletDensity} />
              )}

              <Info label="Box Type" value={calculation.boxType} />
              <Info label="Box Color" value={calculation.boxColor} />
              <Info label="Box Print" value={calculation.boxPrint} />
              <Info label="Box Execution" value={calculation.boxExecution} />
              <Info label="Rolls per Carton" unit="pcs" value={calculation.rollsPerCarton} />
              <Info label="Antislide Paper Sheets" value={calculation.antislidePaperSheets} />
              <Info label="Cartons per Pallet" unit="box" value={calculation.cartonPerPallet} />
              
              <SectionHeader title="Order & Pricing" />
              <Info label="Total Order (Rolls)" unit="rolls" value={calculation.totalOrderInRolls} />
              <Info label="Total Order (Pallets)" unit="pallets" value={calculation.totalOrderInPallets} />
              
              <div className="my-4 border-t border-dashed border-gray-300"></div>

              <Info label="Material Cost" unit="€/roll" value={calculation.materialCost?.toFixed(2)} isCurrency />
              <Info label="WV per Roll" unit="€" value={calculation.WVPerRoll?.toFixed(3)} isCurrency />
              <Info label="Margin" unit="€" value={calculation.margin?.toFixed(3)} isCurrency />
              
              {calculation.material !== 'Baking paper' && (
                <>
                  <Info label="Core" value={calculation.core} />
                  <Info label="Core Price" unit="€/roll" value={calculation.corePrice?.toFixed(3)} isCurrency />
                </>
              )}

              <Info label="Skillet Name" value={calculation.skillet} />
              <Info label="Skillet Price" unit="€/roll" value={calculation.skilletPrice?.toFixed(3)} isCurrency />
              
              <Info label="Umkarton" value={calculation.umkarton} />
              <Info label="Umkarton Price" unit="€/roll" value={calculation.umkartonPrice?.toFixed(3)} isCurrency />

              <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-200">
                <Info label="Total Price per Roll" unit="€" value={calculation.totalPricePerRoll?.toFixed(3)} isCurrency />
                <div className="border-t border-gray-300 my-2"></div>
                <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-blue-700 mt-2">
                  <span>Total Price</span>
                  <span>€ {calculation.totalPrice?.toFixed(3)}</span>
                </div>
              </div>

              {calculation.remarks && (
                 <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                    <span className="font-bold block mb-1">Remarks:</span>
                    {calculation.remarks}
                 </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                <Link
                  href={`/?from=${id}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition shadow-sm text-center"
                >
                  Create based on this calculation
                </Link>
                <button
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  Send to Email
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={async (email) => {
          try {
            await sendEmail(email, calculation, 'recipient', '')
            toast.success("Email sent successfully!")
          } catch (error) {
            console.error("Error sending email:", error)
            toast.error("Failed to send email")
          }
        }}
      />

      <ToastContainer position="bottom-right" />
    </div>
  )
}