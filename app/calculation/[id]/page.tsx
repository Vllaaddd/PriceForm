'use client'

import { EmailModal } from "@/components/email-modal"
import { Info } from "@/components/info"
import { Api } from "@/services/api-client"
import { sendEmail } from "@/services/emails"
import { Calculation } from "@prisma/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

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
              <Info label="Матеріал" value={calculation.material} />
              <Info label="Колір матеріалу" value={calculation.materialColor} />
              <Info label="Ширина" value={`${calculation.materialWidth} мм`} />
              <Info label="Довжина" value={`${calculation.materialLength} мм`} />
              <Info label="Товщина" value={`${calculation.materialThickness} мм`} />
              <Info label="Інші властивості" value={calculation.otherProperties} />
              <Info label="Skillet format" value={calculation.skilletFormat} />
              <Info label="Skillet knife" value={calculation.skilletKnife} />
              <Info label="Skillet density" value={`${calculation.skilletDensity} г/м²`} />
              <Info label="Тип коробки" value={calculation.boxType} />
              <Info label="Колір коробки" value={calculation.boxColor} />
              <Info label="Друк коробки" value={calculation.boxPrint} />
              <Info label="Execution коробки" value={calculation.boxExecution} />
              <Info label="Rolls per carton" value={calculation.rollsPerCarton} />
              <Info label="Antislide paper sheets" value={calculation.antislidePaperSheets} />
              <Info label="Carton per pallet" value={calculation.cartonPerPallet} />
              <Info label="Total order in rolls" value={calculation.totalOrderInRolls} />
              <Info label="Total order in pallets" value={calculation.totalOrderInPallets} />
              <Info label="Період" value={calculation.period} />
              <Info label="Умови доставки" value={calculation.deliveryConditions} />
              <Info label="Адреса доставки" value={calculation.deliveryAddress} />
              <Info label="Reference article" value={calculation.referenceArticle} />
              <Info label="Примітки" value={calculation.remarks} />
            </div>

            <div className="flex justify-center gap-6 mt-8">
                <Link
                    href={`/?from=${id}`}
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow cursor-pointer"
                >
                    Створити на основі цього розрахунку
                </Link>
                <button
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    Вислати розрахунок на Email
                </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Завантаження...</p>
        )}
      </div>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={(email) => sendEmail(email, calculation)}
      />

    </div>
  )
}