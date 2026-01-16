'use client';

import { FC, FormEvent, useEffect, useMemo, useState } from "react"
import { SelectField } from "./select-field"
import { InputField } from "./input-field"
import { Api } from "@/services/api-client"
import { EmailModal } from "./email-modal"
import { sendEmail } from "@/services/emails"
import { ToastContainer, toast } from 'react-toastify';
import Swal from "sweetalert2";
import { EmailText, Period } from "@prisma/client";
import SectionTitle from "./section-title";

type CalculationForm = {
    creator?: string | null
    title?: string | null
    roll?: string | null
    material?: string | null
    materialWidth?: number | null
    materialThickness?: number | null
    materialLength?: number | null
    materialColor?: string | null
    otherProperties?: string | null
    skilletKnife?: string | null
    skilletDensity?: number | null
    boxType?: string | null
    boxColor?: string | null
    boxPrint?: string | null
    boxExecution?: string | null
    lochstanzlinge?: string | null
    rollsPerCarton?: number | null
    antislidePaperSheets?: string | null
    cartonPerPallet?: number | null
    totalOrderInRolls?: number | null
    totalOrderInPallets?: number | null
    period?: string | null
    deliveryConditions?: string | null
    deliveryAddress?: string | null
    referenceArticle?: string | null
    remarks?: string | null
    density?: number | null
    typeOfProduct?: string | null
    rollLength?: string | null
    sheetWidth?: string | null
    sheetLength?: string | null
    sheetQuantity?: number | null
}

type Roll = {
    name: string;
    materials: Material[];
};

type Material = {
    name: string;
    width?: number[];
    thickness?: number[];
    density?: number[];
    typeOfProduct?: string[];
    color?: string[];
    otherProperties?: string[];
    id: number;
};

interface Skillet {
    knife: string[]
    density: number[]
}

interface Box {
    type: string[]
    color: string[]
    print: string[]
    execution: string[]
}

interface Delivery {
    type: string[]
}

interface Props {
    rolls: Roll[]
    skillet: Skillet
    box: Box
    delivery: Delivery
    initialCalculation?: CalculationForm
    lochstanzlinge: string[]
}

export const MaterialChoice: FC<Props> = ({ rolls, skillet, box, delivery, initialCalculation, lochstanzlinge }) => {

    const [form, setForm] = useState<CalculationForm>(initialCalculation || {})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newCalculation, setNewCalculation] = useState<CalculationForm | null>(null)
    const [periods, setPeriods] = useState<Period[]>()
    const [emails, setEmails] = useState<string[]>()
    const [isLoading, setIsLoading] = useState(false)
    const [emailText, setEmailText] = useState<EmailText>()

    const selectedRoll = rolls.find(r => r.name === form.roll)
    const selectedMaterial = selectedRoll?.materials.find(m => m.name === form.material)

    useEffect(() => {
        if (initialCalculation) {
            setForm(initialCalculation)
        }
    }, [initialCalculation])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipients = await Api.recipients.getAll()
                setEmails(recipients.map(r => r.email))

                const text = await Api.emailtext.getText()
                setEmailText(text)

                const periods = await Api.periods.getAll()
                setPeriods(periods)
            } catch (error) {
                console.error(error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (form.deliveryConditions === "EXW" || form.deliveryConditions === "FCA") {
            setForm(prev => ({ ...prev, deliveryAddress: "Singen" }))
        } else if (form.deliveryConditions === "DDP" || form.deliveryConditions === "DAP") {
            setForm(prev => ({ ...prev, deliveryAddress: "" }))
        }
    }, [form.deliveryConditions])

    const totalOrderInPallets = useMemo(() => {
        if (form.totalOrderInRolls && form.cartonPerPallet && form.rollsPerCarton) {
            return form.totalOrderInRolls / form.cartonPerPallet / form.rollsPerCarton;
        }
        return 0;
    }, [form.totalOrderInRolls, form.cartonPerPallet, form.rollsPerCarton]);
    
    const handleChange = (field: keyof CalculationForm, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const createForm = async (form: CalculationForm) => {
        let materialCost = 0
        let WVPerRoll = 0
        let materialName = undefined

        let { material, materialWidth, materialThickness, materialLength, roll, rollsPerCarton, rollLength, sheetLength, sheetWidth, sheetQuantity, typeOfProduct, skilletKnife, skilletDensity, totalOrderInRolls, period } = form
        if (material === 'Baking paper') {
            materialName = 'BP'
        } else {
            materialName = material
        }

        const { density, costPerKg } = await Api.periods.find({
            period: period || "",
            material: materialName || "",
        })

        let materialWeight = 0

        if (materialWidth && materialThickness && materialLength && density && material !== 'BP') {
            materialWeight = materialWidth * materialThickness * materialLength * Number(density) / 1000000
            materialCost = materialWeight * Number(costPerKg)
        } else {
            if (typeOfProduct !== 'Consumer sheets' && materialWidth && rollLength && form.density) {
                const square = (materialWidth / 1000) * Number(rollLength)
                materialWeight = (square * form.density) / 1000
                materialCost = materialWeight * Number(costPerKg)
                materialLength = Number(rollLength)
            } else if (typeOfProduct === 'Consumer sheets' && sheetLength && sheetWidth && sheetQuantity && form.density) {
                const square = (Number(sheetWidth) / 1000) * (Number(sheetLength) / 1000) * sheetQuantity
                materialWeight = (square * form.density) / 1000
                materialCost = materialWeight * Number(costPerKg)
                materialLength = Number(sheetLength) * Number(sheetQuantity) / 1000
            }
        }

        const line = await Api.lines.find({
            material: material || '',
            lineType: roll || '',
            length: materialLength || 0,
            width: materialWidth || 0,
        });

        WVPerRoll = line.price;

        const core = await Api.cores.find({ length: materialWidth || 0, type: roll || '' })

        let coreName = `Hülse ${core.length} x ${core.width} x ${core.thickness} mm`
        let corePrice = core.price;

        if (core.type === 'No suitable core found') {
            coreName = 'No suitable core found'
        }

        if (material === 'Baking paper') {
            coreName = '-'
            corePrice = 0
        }

        let height = 0;

        if (materialThickness && materialLength && roll !== 'BP') {
            const coreOutsideDiameter = core.width + core.thickness * 2
            height = Math.sqrt(((materialLength * 4 * materialThickness) / Math.PI) + (coreOutsideDiameter ** 2)) * 1.02;
        } else if (rollLength && sheetQuantity && roll === 'BP') {
            if (typeOfProduct === 'Consumer sheets') {
                if (sheetQuantity <= 15) {
                    height = 39
                } else if (sheetQuantity > 15 && sheetQuantity <= 20) {
                    height = 45
                } else {
                    height = 50
                }
            } else if (typeOfProduct !== 'Consumer sheets') {
                if (Number(rollLength) <= 20) {
                    height = 39
                } else if (Number(rollLength) > 20 && Number(rollLength) <= 40) {
                    height = 45
                } else {
                    height = 50
                }
            }
        }

        const skillet = await Api.skillets.find({
            width: roll !== 'BP' ? core.length : materialWidth || 0,
            height,
            knife: skilletKnife || '',
            density: Number(skilletDensity)
        })

        const skilletName = skillet.article;
        let skilletPrice = 0;

        if (skillet && totalOrderInRolls) {
            const tierPrice = skillet?.tierPrices?.find((tp) => totalOrderInRolls > tp.tier.minQty && totalOrderInRolls <= tp.tier.maxQty);

            skilletPrice = tierPrice ? tierPrice.price : 0;
        }

        const umkarton = await Api.umkartons.find({
            fsDimension: skillet.height,
            displayCarton: form.boxType === 'Display' ? 'ja' : 'nein',
            bedoManu: roll === 'Consumer' ? 'ja' : 'nein',
            color: form.boxColor || '',
            width: skillet.width,
        })

        const umkartonName = umkarton.article;
        let umkartonPrice = 0;

        if (umkarton.deckel !== 'nein') {
            const deckelPrice = await Api.deckels.find({ article: umkarton.deckel })
            umkartonPrice = deckelPrice.price;
        }

        if (umkarton && totalOrderInRolls) {
            umkartonPrice = umkartonPrice + (umkarton.basePrice / Number(rollsPerCarton));
        }

        const totalPricePerRoll = Number(materialCost) + Number(WVPerRoll) + Number(skilletPrice) + Number(corePrice) + Number(umkartonPrice);
        let totalPrice = totalPricePerRoll * (totalOrderInRolls || 0);
        let margin = 0;

        if (totalOrderInRolls && totalOrderInRolls <= 30000) {
            totalPrice = totalPrice * 1.07
            margin = 7
        } else if (totalOrderInRolls && (totalOrderInRolls > 30000 && totalOrderInRolls <= 200000)) {
            totalPrice = totalPrice * 1.05
            margin = 5
        } else if (totalOrderInRolls && totalOrderInRolls > 200000) {
            totalPrice = totalPrice * 1.03
            margin = 3
        }

        return { materialCost, WVPerRoll, skilletPrice, skillet: skilletName, corePrice, core: coreName, umkarton: umkartonName, umkartonPrice, totalPricePerRoll, totalPrice, margin, materialWeight, foliePricePerKg: Number(costPerKg), materialLength, totalOrderInPallets }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const { id, createdAt, updatedAt, ...cleanForm } = form as any
        setIsLoading(true)

        const props = await createForm(cleanForm)

        const swalFire = (msg: string) => {
            Swal.fire({
                title: `${msg} Do you want to create calculation?`,
                showDenyButton: true,
                denyButtonColor: 'red',
                confirmButtonText: "Create",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await Api.calculations.createCalculation({ ...cleanForm, ...props })
                    emails?.map(email => {
                        sendEmail(email, cleanForm, 'recipient', emailText?.text || '')
                    })
                    sendEmail(form.creator || '', cleanForm, 'creator', emailText?.text || '')
                    setForm({})
                    setIsLoading(false)
                    toast.success('Calculation created!')
                } else if (result.isDenied) {
                    setIsLoading(false)
                    return
                }
            });
        }

        if (props.core === "No suitable core found" && props.skillet === "This type of skillet isn't available" && props.umkarton === "This type of umkarton isn't available") {
            swalFire("This type of skillet isn't available and no suitable core found and no suitable umkarton found.")
            return
        } if (props.core === "No suitable core found" && props.skillet === "This type of skillet isn't available") {
            swalFire("This type of skillet isn't available and no suitable core found.")
            return
        } else if (props.core === "No suitable core found") {
            swalFire("No suitable core found.")
            return
        } else if (props.skillet === "This type of skillet isn't available") {
            swalFire("This type of skillet isn't available.")
            return
        } else if (props.umkarton === "This type of umkarton isn't available") {
            swalFire("This type of umkarton isn't available.")
            return
        }

        await Api.calculations.createCalculation({ ...cleanForm, ...props })
        emails?.map(email => {
            sendEmail(email, cleanForm, 'recipient', emailText?.text || '')
        })
        sendEmail(form.creator || '', cleanForm, 'creator', emailText?.text || '')
        setForm({})
        setIsLoading(false)
        toast.success('Calculation created!')

    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <form
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-4xl mx-auto"
                onSubmit={handleSubmit}
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Calculation Configuration
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">Fill in the details to generate a new price calculation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    <SectionTitle title="1. General Information" />

                    <InputField
                        label="Title"
                        type="string"
                        value={form.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Title"
                    />

                    <InputField
                        label="Creator (Email)"
                        type="email"
                        value={form.creator || ""}
                        onChange={(e) => handleChange("creator", e.target.value)}
                        placeholder="your.email@company.com"
                    />

                    <SectionTitle title="2. Material Specifications" />

                    <SelectField
                        label="Roll Type"
                        value={form.roll || ""}
                        onChange={(e) => handleChange("roll", e.target.value)}
                    >
                        <option value="">-- Choose Roll Type --</option>
                        {rolls.map((r, i) => (
                            <option key={i} value={r.name}>
                                {r.name}
                            </option>
                        ))}
                    </SelectField>

                    {selectedRoll && (
                        <SelectField
                            label="Material"
                            value={form.material || ""}
                            onChange={(e) => handleChange("material", e.target.value)}
                        >
                            <option value="">-- Choose Material --</option>
                            {selectedRoll.materials.map((m) => (
                                <option key={m.id} value={m.name}>
                                    {m.name}
                                </option>
                            ))}
                        </SelectField>
                    )}

                    <SelectField
                        label="Width (mm)"
                        value={form.materialWidth || ""}
                        onChange={(e) => handleChange("materialWidth", Number(e.target.value))}
                        disabled={!selectedMaterial}
                    >
                        <option value="">-- Select --</option>
                        {selectedMaterial?.width?.map((w, i) => (
                            <option key={i} value={w}>
                                {w}
                            </option>
                        ))}
                    </SelectField>

                    {selectedMaterial?.name !== 'Baking paper' && (
                        <>
                            <SelectField
                                label="Thickness (my)"
                                value={form.materialThickness || ""}
                                onChange={(e) => handleChange("materialThickness", Number(e.target.value))}
                                disabled={!selectedMaterial}
                            >
                                <option value="">-- Select --</option>
                                {selectedMaterial?.thickness?.map((t, i) => (
                                    <option key={i} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </SelectField>

                            <InputField
                                label="Length (m)"
                                type="string"
                                value={form.materialLength || ""}
                                onChange={(e) => handleChange("materialLength", Number(e.target.value))}
                                disabled={!selectedMaterial}
                            />
                        </>
                    )}

                    {selectedMaterial?.name === 'Baking paper' && (
                        <>
                            <SelectField
                                label="Density (g/m²)"
                                value={form.density || ""}
                                onChange={(e) => handleChange("density", Number(e.target.value))}
                                disabled={!selectedMaterial}
                            >
                                <option value="">-- Select --</option>
                                {selectedMaterial?.density?.map((d, i) => (
                                    <option key={i} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="Type of Product"
                                value={form.typeOfProduct || ""}
                                onChange={(e) => handleChange("typeOfProduct", e.target.value)}
                                disabled={!selectedMaterial}
                            >
                                <option value="">-- Select --</option>
                                {selectedMaterial?.typeOfProduct?.map((t, i) => (
                                    <option key={i} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </SelectField>
                        </>
                    )}

                    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(form.typeOfProduct === 'Consumer sheets' && form.material === 'Baking paper') && (
                            <>
                                <InputField
                                    label="Sheet Width (mm)"
                                    type="string"
                                    value={form.sheetWidth || ""}
                                    onChange={(e) => handleChange("sheetWidth", e.target.value)}
                                />
                                <InputField
                                    label="Sheet Length (mm)"
                                    type="string"
                                    value={form.sheetLength || ""}
                                    onChange={(e) => handleChange("sheetLength", e.target.value)}
                                />
                                <InputField
                                    label="Sheet Quantity (max 30)"
                                    type="string"
                                    max={30}
                                    value={form.sheetQuantity || ""}
                                    onChange={(e) => handleChange("sheetQuantity", Number(e.target.value))}
                                />
                            </>
                        )}
                    </div>

                    {(form.typeOfProduct === 'Consumer roll' || form.typeOfProduct === 'Catering roll' && form.material === 'Baking paper') && (
                        <div className="col-span-full md:col-span-1">
                            <InputField
                                label="Roll Length (m)"
                                type="string" value={form.rollLength || ""}
                                onChange={(e) => handleChange("rollLength", e.target.value)}
                            />
                        </div>
                    )}

                    <SelectField
                        label={selectedRoll?.name === 'BP' ? 'Paper color' : 'Color'}
                        value={form.materialColor || ""}
                        onChange={(e) => handleChange("materialColor", e.target.value)}
                        disabled={!selectedMaterial}
                    >
                        <option value="">-- Select --</option>
                        {selectedMaterial?.color?.map((c, i) => (
                            <option key={i} value={c}>
                                {c}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField
                        label="Other Properties"
                        value={form.otherProperties || ""}
                        onChange={(e) => handleChange("otherProperties", e.target.value)}
                        disabled={!selectedMaterial}
                    >
                        <option value="">-- Select --</option>
                        {selectedMaterial?.otherProperties?.map((o, i) => (
                            <option key={i} value={o}>
                                {o}
                            </option>
                        ))}
                    </SelectField>

                    <SectionTitle title="3. Packaging (Skillet & Box)" />

                    <SelectField
                        label="Skillet Knife"
                        value={form.skilletKnife || ""}
                        onChange={(e) => handleChange("skilletKnife", e.target.value)}
                    >
                        <option value="">-- Select --</option>
                        {skillet.knife.map((k, i) => (
                            <option key={i} value={k}>
                                {k}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField
                        label="Skillet Density"
                        value={form.skilletDensity || ""}
                        onChange={(e) => handleChange("skilletDensity", Number(e.target.value))}
                    >
                        <option value="">-- Select --</option>
                        {skillet.density.map((d, i) => (
                            <option key={i} value={d}>
                                {d}
                            </option>
                        ))}
                    </SelectField>

                    {selectedRoll?.name === "Catering" && (
                        <div className="col-span-full">
                            <SelectField label="Lochstanzlinge" value={form.lochstanzlinge || ""} onChange={(e) => handleChange("lochstanzlinge", e.target.value)}>
                                <option value="">-- Choose Lochstanzlinge --</option>
                                {lochstanzlinge.map((l, i) => (
                                    <option key={i} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </SelectField>
                        </div>
                    )}

                    <div className="col-span-full h-px bg-gray-100 my-2" />

                    <SelectField label="Box Type" value={form.boxType || ""} onChange={(e) => handleChange("boxType", e.target.value)}>
                        <option value="">-- Select --</option>
                        {box.type.map((t, i) => (
                            <option key={i} value={t}>
                                {t}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField label="Box Color" value={form.boxColor || ""} onChange={(e) => handleChange("boxColor", e.target.value)}>
                        <option value="">-- Select --</option>
                        {box.color.map((c, i) => (
                            <option key={i} value={c}>
                                {c}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField label="Box Print" value={form.boxPrint || ""} onChange={(e) => handleChange("boxPrint", e.target.value)}>
                        <option value="">-- Select --</option>
                        {(selectedRoll?.name === "BP"
                            ? box.print.slice(0, -1)
                            : box.print
                        ).map((p, i) => (
                            <option key={i} value={p}>
                                {p}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField label="Box Execution" value={form.boxExecution || ""} onChange={(e) => handleChange("boxExecution", e.target.value)}>
                        <option value="">-- Select --</option>
                        {box.execution.map((ex, i) => (
                            <option key={i} value={ex}>
                                {ex}
                            </option>
                        ))}
                    </SelectField>

                    <SectionTitle title="4. Logistics & Quantity" />

                    <InputField
                        label="Rolls per Carton"
                        type="string"
                        value={form.rollsPerCarton || ""}
                        onChange={(e) => handleChange("rollsPerCarton", Number(e.target.value))}
                    />
                    
                    <InputField
                        label="Cartons per Pallet"
                        type="string"
                        value={form.cartonPerPallet || ""}
                        onChange={(e) => handleChange("cartonPerPallet", Number(e.target.value))}
                    />

                    <SelectField
                        label="Antislide Sheets"
                        value={form.antislidePaperSheets || ""}
                        onChange={(e) => handleChange("antislidePaperSheets", e.target.value)}
                    >
                        <option value="">-- Select --</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </SelectField>
                    
                    <SelectField
                        label="Period"
                        value={form.period || ""}
                        onChange={(e) => handleChange("period", e.target.value)}
                    >
                        <option value="">-- Choose Period --</option>
                        {periods?.map((period, i) => (
                            <option key={i} value={period.period}>
                                {period.period}
                            </option>
                        ))}
                    </SelectField>

                    <InputField
                        label="Total Order (Rolls)"
                        type="string"
                        value={form.totalOrderInRolls || ""}
                        onChange={(e) => handleChange("totalOrderInRolls", Number(e.target.value))}
                    />

                    {totalOrderInPallets !== undefined && !isNaN(totalOrderInPallets || 0) && (
                        <div className="col-span-full bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                            <span className="text-blue-900 font-medium">Total Order in Pallets:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {totalOrderInPallets?.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <SelectField
                        label="Delivery Conditions"
                        value={form.deliveryConditions || ""}
                        onChange={(e) => handleChange("deliveryConditions", e.target.value)}
                    >
                        <option value="">-- Select --</option>
                        {delivery.type.map((d, i) => (
                            <option key={i} value={d}>
                                {d}
                            </option>
                        ))}
                    </SelectField>

                    <InputField
                        label="Delivery Address"
                        type="string"
                        value={form.deliveryAddress || ""}
                        onChange={(e) => handleChange("deliveryAddress", e.target.value)}
                        disabled={form.deliveryConditions === "EXW" || form.deliveryConditions === "FCA"}
                    />

                    <div className="col-span-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Reference Article (Optional)"
                            type="string"
                            value={form.referenceArticle || ""}
                            onChange={(e) => handleChange("referenceArticle", e.target.value)}
                            required={false}
                        />

                        <InputField
                            label="Remarks (Optional)"
                            type="string"
                            value={form.remarks || ""}
                            onChange={(e) => handleChange("remarks", e.target.value)}
                            required={false}
                        />
                    </div>

                </div>

                <div className="mt-10 flex justify-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`
                            w-full md:w-auto md:min-w-[200px] px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer
                            ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Create Calculation'}
                    </button>
                </div>
            </form>

            <EmailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSend={async (email) => {
                    try {
                        await sendEmail(email, newCalculation, 'recipient', emailText?.text || '')
                        toast.success("Calculation created and email sent successfully!")
                    } catch (error) {
                        console.error("Error sending email:", error)
                        toast.error("Failed to send email")
                    }
                }}
            />

            <ToastContainer position="bottom-right" theme="colored" />
        </div>
    )
}