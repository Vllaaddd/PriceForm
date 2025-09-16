'use client'

import { Api } from "@/services/api-client"
import { Calculation } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home(){

    const [calculations, setCalculations] = useState<Calculation[]>([])

    useEffect(() => {

        async function fetchCalculations(){
            try{
                const calculations = await Api.calculations.getAll()
                setCalculations(calculations)      
            }catch(err){
                console.error(err)
            }
        }

        fetchCalculations()
        
    }, [])

    return(
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-5xl mx-auto">
                
                <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                    Всі розрахунки
                </h1>

                {calculations.length === 0 && (
                    <p className="text-center text-gray-500">
                        Немає розрахунків
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {calculations.map((calculation, index) => (
                        <Link
                            href={`/calculation/${calculation.id}`}
                            className="flex flex-col items-center justify-center text-center w-[280px] bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                            key={index}
                        >
                            <h2 className="text-lg font-bold mb-2">{calculation.title}</h2>
                            <p className="text-sm text-gray-600 mb-1">Матеріал: {calculation.material}</p>
                            <p className="text-sm text-gray-600 mb-1">Колір: {calculation.materialColor}</p>
                            <p className="text-sm text-gray-600 mb-1">
                                {calculation.materialWidth} × {calculation.materialLength} × {calculation.materialThickness} мм
                            </p>
                            <p className="text-sm text-gray-600 mb-1">Тип коробки: {calculation.boxType}</p>
                            <p className="text-sm text-gray-600 mb-1">
                                Кількість: {calculation.totalOrderInRolls} рулонів
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}