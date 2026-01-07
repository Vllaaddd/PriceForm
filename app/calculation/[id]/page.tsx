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
import { 
    Calendar, User, FileText, Package, Truck, Box, 
    CreditCard, Mail, Copy, ChevronLeft, Layers 
} from "lucide-react"

export default function CalulcationPage(){

    const pathname = usePathname()
    const parts = pathname.split("/")
    const id = parts[parts.length - 1]

    const [calculation, setCalculation] = useState<Calculation | undefined>(undefined)
    const [emailText, setEmailText] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        async function fetchCalculations() {
            try {
                const calculation = await Api.calculations.getOneCalculation(id)
                setCalculation(calculation)

                const text = await Api.emailtext.getText()
                setEmailText(text.text)
            } catch (err) {
                console.error(err)
            }
        }
        fetchCalculations()
    }, [id])

    return(
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                
                <div className="mb-6">
                    <Link href="/all-calculations" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Calculations
                    </Link>
                </div>

                {calculation ? (
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            
                        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 sm:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 opacity-80">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm font-medium uppercase tracking-wider">Calculation Details</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-bold">{calculation.title}</h1>
                                    <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-90">
                                        <span className="flex items-center gap-1.5 bg-blue-800/30 px-3 py-1 rounded-full border border-blue-400/20">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(calculation.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-blue-800/30 px-3 py-1 rounded-full border border-blue-400/20">
                                            <User className="w-3.5 h-3.5" />
                                            {calculation.creator}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 min-w-[160px]">
                                    <p className="text-xs uppercase opacity-70 mb-1">Total Price</p>
                                    <p className="text-2xl font-bold">€ {calculation.totalPrice?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-10">
                    
                            <SectionHeader title="General Information" icon={<FileText className="w-5 h-5"/>} />
                            <div className="grid gap-1">
                                <Info label="Roll type" value={calculation.roll} />
                                <Info label="Period" value={calculation.period} />
                                <Info label="Reference Article" value={calculation.referenceArticle} />
                            </div>

                            <SectionHeader title="Logistics" icon={<Truck className="w-5 h-5"/>} />
                            <div className="grid gap-1">
                                <Info label="Delivery Conditions" value={calculation.deliveryConditions} />
                                <Info label="Delivery Address" value={calculation.deliveryAddress} />
                            </div>

                            <SectionHeader title="Material Specifications" icon={<Package className="w-5 h-5"/>} />
                            <div className="grid gap-1">
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
                                        <Info label="Sheet Width" unit="mm" value={calculation.sheetWidth} />
                                        <Info label="Sheet Length" unit="mm" value={calculation.sheetLength} />
                                        <Info label="Sheet Quantity" unit="pcs" value={calculation.sheetQuantity} />
                                    </>
                                ) : calculation.typeOfProduct === 'Consumer roll' ? (
                                    <Info label="Roll Length" unit="m" value={calculation.rollLength} />
                                ) : null}
                            </div>

                            <SectionHeader title="Packaging & Box" icon={<Box className="w-5 h-5"/>} />
                            <div className="grid gap-1">
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
                            </div>

                            <SectionHeader title="Components Configuration" icon={<Layers className="w-5 h-5"/>} />
                            <div className="grid gap-1">
                                {calculation.material !== 'Baking paper' && (
                                    <Info label="Core" value={calculation.core} />
                                )}
                                <Info label="Skillet Name" value={calculation.skillet} />
                                <Info label="Umkarton" value={calculation.umkarton} />
                            </div>
                        
                            <SectionHeader title="Order & Pricing" icon={<CreditCard className="w-5 h-5"/>} />
                            <div className="grid gap-1">
                                <Info label="Total Order (Rolls)" unit="rolls" value={calculation.totalOrderInRolls.toLocaleString()} />
                                <Info label="Total Order (Pallets)" unit="pallets" value={calculation.totalOrderInPallets.toLocaleString()} />
                                
                                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <span className="font-medium text-gray-600">Total Price per Roll</span>
                                        <span className="font-bold text-gray-900">€ {calculation.totalPricePerRoll?.toFixed(3)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 px-3 bg-blue-600 text-white rounded-lg shadow-md transform scale-105 origin-center mt-3">
                                        <span className="font-medium opacity-90">Total Price</span>
                                        <span className="text-xl font-bold">€ {calculation.totalPrice?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                </div>
                            </div>

                            {calculation.remarks && (
                                <div className="mt-8 bg-amber-50 p-5 rounded-xl border border-amber-100 flex gap-3 text-amber-900">
                                    <div className="mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="font-bold block mb-1">Remarks</span>
                                        <p className="text-sm opacity-90 leading-relaxed">{calculation.remarks}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 pt-8 border-t border-gray-100">
                                <Link href={`/create-calculation?from=${id}`} className="w-full sm:w-auto">
                                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition shadow-sm group cursor-pointer">
                                        <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Duplicate & Edit
                                    </button>
                                </Link>
                                
                                <button
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition transform hover:-translate-y-0.5 cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Mail className="w-4 h-4" />
                                    Send to Email
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-[60vh] bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading details...</p>
                    </div>
                )}

                <EmailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSend={async (email) => {
                    try {
                        await sendEmail(email, calculation, 'creator', emailText)
                        toast.success("Email sent successfully!")
                    } catch (error) {
                        console.error("Error sending email:", error)
                        toast.error("Failed to send email")
                    }
                    }}
                />

                <ToastContainer position="top-right" />
            </div>
        </div>
    )
}