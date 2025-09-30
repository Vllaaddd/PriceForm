'use client'

import { Api } from "@/services/api-client"
import { Calculation } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home(){

    const [calculations, setCalculations] = useState<Calculation[]>([])
    const [viewVariant, setViewVariant] = useState<'grid' | 'table'>('grid')

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
        <div className="min-h-screen bg-gray-200 py-10 px-6">
            <div className="max-w-5xl mx-auto">
                
                <div className="flex items-center justify-center gap-5 md:gap-10 mb-10">
                    <h1 className="text-3xl font-bold text-center text-gray-800">
                        All сalculations
                    </h1>
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                            className="w-8 h-8 text-gray-600 cursor-pointer"
                            onClick={() => setViewVariant('grid')}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                            className="w-8 h-8 text-gray-600 cursor-pointer"
                            onClick={() => setViewVariant('table')}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                        </svg>
                    </div>
                </div>

                {calculations.length === 0 && (
                    <p className="text-center text-gray-500">
                        No calculations found
                    </p>
                )}

                {viewVariant === 'table' && (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3 text-left">Title</th>
                                    <th className="p-3 text-left">Material</th>
                                    <th className="p-3 text-left">Dimensions</th>
                                    <th className="p-3 text-left">Color</th>
                                    <th className="p-3 text-left">Box type</th>
                                    <th className="p-3 text-left">Total rolls</th>
                                    <th className="p-3 text-left">Period</th>
                                    <th className="p-3 text-left">More info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {calculations.map((calculation) => (
                                    <tr className="border-t hover:bg-gray-50 transition">
                                        <td className="p-3 font-medium">
                                            {calculation.title}
                                        </td>
                                        <td className="p-3">{calculation.material}</td>
                                        <td className="p-3">
                                            {calculation.material === "Baking paper" ? (
                                                `${calculation?.materialWidth} × ${calculation.rollLength} mm`
                                            ) : (
                                                `${calculation.materialWidth} × ${calculation.materialLength} ×
                                                ${calculation.materialThickness} mm`
                                            )}
                                        </td>
                                        <td className="p-3">{calculation.materialColor}</td>
                                        <td className="p-3">{calculation.boxType}</td>
                                        <td className="p-3">{calculation.totalOrderInRolls}</td>
                                        <td className="p-3">{calculation.period}</td>
                                        <td className="p-3 underline font-bold"><Link href={`/calculation/${calculation.id}`}>See more</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {viewVariant === 'grid' && (
                    <div className="flex items-center justify-center flex-wrap gap-6">
                        {calculations.map((calculation, index) => (
                            <Link
                                href={`/calculation/${calculation.id}`}
                                className="flex flex-col items-center justify-center text-center w-[280px] bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                                key={index}
                            >
                                <h2 className="text-lg font-bold mb-2">{calculation.title}</h2>
                                <p className="text-sm text-gray-600 mb-1">Material: {calculation.material}</p>
                                <p className="text-sm text-gray-600 mb-1">Roll type: {calculation.roll}</p>
                                <p className="text-sm text-gray-600 mb-1">Color: {calculation.materialColor}</p>
                                <p className="text-sm text-gray-600 mb-1">
                                    {calculation.material === "Baking paper" ? (
                                        `${calculation?.materialWidth} × ${calculation.rollLength} mm`
                                    ) : (
                                        `${calculation.materialWidth} × ${calculation.materialLength} ×
                                        ${calculation.materialThickness} mm`
                                    )}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">Box type: {calculation.boxType}</p>
                                <p className="text-sm text-gray-600 mb-1">
                                    Total order in rolls: {calculation.totalOrderInRolls}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}