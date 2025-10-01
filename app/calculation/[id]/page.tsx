'use client'

import { EmailModal } from "@/components/email-modal"
import { Info } from "@/components/info"
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {calculation ? (
          <div className="bg-white shadow-md rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {calculation.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Creator" value={calculation.creator} />
              <Info label="Roll type" value={calculation.roll} />
              <Info label="Material" value={calculation.material} />
              <Info label={calculation.material === "Baking paper" ? 'Paper color': 'Material color'} value={calculation.materialColor} />
              <Info label="Width" value={`${calculation.materialWidth} мм`} />
              {calculation.material === "Baking paper" ? (
                <>
                  <Info label="Density" value={`${calculation.density} g/m²`} />
                  <Info label="Type of product" value={`${calculation.typeOfProduct}`} />
                </>
              ) : (
                <>
                  <Info label="Length" value={`${calculation.materialLength} мм`} />
                  <Info label="Thickness" value={`${calculation.materialThickness} мм`} />
                </>
              )}
              {calculation.typeOfProduct === 'Consumer sheets' ? (
                <>
                  <Info label="Sheet width" value={`${calculation.sheetWidth}`} />
                  <Info label="Sheet length" value={`${calculation.sheetLength}`} />
                  <Info label="Sheet quantity" value={`${calculation.sheetQuantity}`} />
                </>
              ) : (
                <>
                  <Info label="Roll length" value={`${calculation.rollLength}`} />
                </>
              )}
              <Info label="Other properties" value={calculation.otherProperties} />
              <Info label="Skillet format" value={calculation.skilletFormat} />
              {calculation.skilletKnife !== null && (
                <Info label="Skillet knife" value={calculation.skilletKnife} />
              )}
              {calculation.roll === 'Catering' ?
                <Info label="Lochstanzlinge" value={calculation.lochstanzlinge ?? ""} />
               : (
                <Info label="Skillet density" value={`${calculation.skilletDensity} g/m²`} />
              )}
              <Info label="Box type" value={calculation.boxType} />
              <Info label="Box color" value={calculation.boxColor} />
              <Info label="Box print" value={calculation.boxPrint} />
              <Info label="Box execution" value={calculation.boxExecution} />
              <Info label="Rolls per carton" value={calculation.rollsPerCarton} />
              <Info label="Antislide paper sheets" value={calculation.antislidePaperSheets} />
              <Info label="Carton per pallet" value={calculation.cartonPerPallet} />
              <Info label="Total order in rolls" value={calculation.totalOrderInRolls} />
              <Info label="Total order in pallets" value={calculation.totalOrderInPallets} />
              <Info label="Period" value={calculation.period} />
              <Info label="Delivery conditions" value={calculation.deliveryConditions} />
              <Info label="Delivery address" value={calculation.deliveryAddress} />
              { calculation.referenceArticle && (
                <Info label="Reference article" value={calculation.referenceArticle} />
              )}
              { calculation.remarks && ( 
                <Info label="Remarks" value={calculation.remarks} />
              )}
            </div>

            <div className="flex justify-center gap-6 mt-8">
                <Link
                    href={`/?from=${id}`}
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow cursor-pointer"
                >
                    Create based on this calculation
                </Link>
                <button
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    Send to email
                </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={async (email) => {
          try {
            await sendEmail(email, calculation)
            toast.success("Email sent successfully!")
          } catch (error) {
            console.error("Error sending email:", error)
            toast.error("Failed to send email")
          }
        }}
      />

      <ToastContainer />

    </div>
  )
}