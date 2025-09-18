'use client'

import { FC, FormEvent, useEffect, useState } from "react"
import { SelectField } from "./select-field"
import { InputField } from "./input-field"
import { Api } from "@/services/api-client"
import { EmailModal } from "./email-modal"
import { sendEmail } from "@/services/emails"
import { ToastContainer, toast } from 'react-toastify';

type CalculationForm = {
  creator?: string
  title?: string
  material?: string
  materialWidth?: number
  materialThickness?: number
  materialLength?: number
  materialColor?: string
  otherProperties?: string
  skilletFormat?: number
  skilletKnife?: string
  skilletDensity?: number
  boxType?: string
  boxColor?: string
  boxPrint?: string
  boxExecution?: string
  rollsPerCarton?: number
  antislidePaperSheets?: string
  cartonPerPallet?: number
  totalOrderInRolls?: number
  totalOrderInPallets?: number
  period?: string
  deliveryConditions?: string
  deliveryAddress?: string
  referenceArticle?: string | null
  remarks?: string | null
}

interface Material {
  id: number
  name: string
  width: number[]
  thickness: number[]
  color: string[]
  otherProperties: string[]
}

interface Skillet {
  format: number[]
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
  materials: Material[]
  skillet: Skillet
  box: Box
  delivery: Delivery
  initialCalculation?: CalculationForm
}

export const MaterialChoice: FC<Props> = ({ materials, skillet, box, delivery, initialCalculation }) => {

  const [form, setForm] = useState<CalculationForm>(initialCalculation || {})
  const selectedMaterial = materials.find(m => m.name === form.material)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCalculation, setNewCalculation] = useState<CalculationForm | null>(null)
  const email = 'vladikhoncharuk@gmail.com'

  const handleChange = (field: keyof CalculationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const { id, createdAt, updatedAt, ...cleanForm } = form as any

    await Api.calculations.createCalculation(cleanForm)
    sendEmail(email || "", cleanForm)
    setForm({})
    toast.success('Calculation created!')
  }

  const handleSubmitAndEmail = async (e: FormEvent) => {
    e.preventDefault()

    const formEl = e.target as HTMLFormElement
    if (!formEl.closest("form")?.checkValidity()) {
      formEl.closest("form")?.reportValidity()
      return
    }

    const { id, createdAt, updatedAt, ...cleanForm } = form as any
    const created = await Api.calculations.createCalculation(cleanForm)

    setNewCalculation(created)
    setIsModalOpen(true)
    setForm({})
  }
    
  useEffect(() => {
    if (initialCalculation) {
      setForm(initialCalculation)
    }
  }, [initialCalculation])

  useEffect(() => {
    if (form.totalOrderInRolls && form.cartonPerPallet && form.rollsPerCarton) {
      const result = form.totalOrderInRolls / form.cartonPerPallet / form.rollsPerCarton
      setForm(prev => ({ ...prev, totalOrderInPallets: result }))
    }
  }, [form.totalOrderInRolls, form.cartonPerPallet, form.rollsPerCarton])

  useEffect(() => {
    if (form.deliveryConditions === "EXW" || form.deliveryConditions === "FCA") {
      setForm(prev => ({ ...prev, deliveryAddress: "Sinngen" }))
    }else if (form.deliveryConditions === "DDP" || form.deliveryConditions === "DAP") {
      setForm(prev => ({ ...prev, deliveryAddress: "" }))
    }
  }, [form.deliveryConditions])

  useEffect(() => {
    if (form.material === "Alu") {
      setForm(prev => ({ ...prev, materialColor: "Silver" }))
    } else if (form.material === "Pe") {
      setForm(prev => ({ ...prev, materialColor: "Transparent" }))
    }
  }, [form.material])

  return (
    <>
      <form
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Calculation configuration
        </h2>

        <div className="grid gap-4">
          {/* Назва */}
          <InputField label="Title" type="string" value={form.title || ""} onChange={(e) => handleChange("title", e.target.value)} />

          {/* Creator */}
          <InputField label="Creator (your email)" type="string" value={form.creator || ""} onChange={(e) => handleChange("creator", e.target.value)} />

          {/* Матеріал */}
          <SelectField label="Material" value={form.material || ""} onChange={(e) => handleChange("material", e.target.value)}>
            <option value="">-- choose material --</option>
            {materials.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </SelectField>

          {/* Ширина */}
          <SelectField
            label="Width (mm)"
            value={form.materialWidth || ""}
            onChange={(e) => handleChange("materialWidth", Number(e.target.value))}
            disabled={!selectedMaterial}
          >
            <option value="">-- choose width --</option>
            {selectedMaterial?.width.map((w, i) => (
              <option key={i} value={w}>
                {w}
              </option>
            ))}
          </SelectField>

          {/* Товщина */}
          <SelectField
            label="Thickness (my)"
            value={form.materialThickness || ""}
            onChange={(e) => handleChange("materialThickness", Number(e.target.value))}
            disabled={!selectedMaterial}
          >
            <option value="">-- choose thickness --</option>
            {selectedMaterial?.thickness.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </SelectField>

          {/* Довжина */}
          <InputField label="Length (m)" type="number" value={form.materialLength || ""} onChange={(e) => handleChange("materialLength", Number(e.target.value))} />

          {/* Колір */}
          <SelectField
            label="Color"
            value={form.materialColor || ""}
            onChange={(e) => handleChange("materialColor", e.target.value)}
            disabled={!selectedMaterial}
          >
            <option value="">-- choose color --</option>
            {selectedMaterial?.color.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </SelectField>

          {/* Інші властивості */}
          <SelectField
            label="Other properties"
            value={form.otherProperties || ""}
            onChange={(e) => handleChange("otherProperties", e.target.value)}
            disabled={!selectedMaterial}
          >
            <option value="">-- choose other properties --</option>
            {selectedMaterial?.otherProperties.map((o, i) => (
              <option key={i} value={o}>
                {o}
              </option>
            ))}
          </SelectField>

          {/* Skillet */}
          <SelectField label="Skillet format" value={form.skilletFormat || ""} onChange={(e) => handleChange("skilletFormat", Number(e.target.value))}>
            <option value="">-- choose skillet format --</option>
            {skillet.format.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </SelectField>

          {/* Skillet knife */}
          <SelectField label="Skillet knife" value={form.skilletKnife || ""} onChange={(e) => handleChange("skilletKnife", e.target.value)}>
            <option value="">-- choose skillet knife --</option>
            {skillet.knife.map((k, i) => (
              <option key={i} value={k}>
                {k}
              </option>
            ))}
          </SelectField>

          {/* Skillet density */}
          <SelectField label="Skillet density" value={form.skilletDensity || ""} onChange={(e) => handleChange("skilletDensity", Number(e.target.value))}>
            <option value="">-- choose skillet density --</option>
            {skillet.density.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </SelectField>

          {/* Box */}
          <SelectField label="Box type" value={form.boxType || ""} onChange={(e) => handleChange("boxType", e.target.value)}>
            <option value="">-- choose box type --</option>
            {box.type.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </SelectField>

          {/* Колір коробки */}
          <SelectField label="Box color" value={form.boxColor || ""} onChange={(e) => handleChange("boxColor", e.target.value)}>
            <option value="">-- choose box color --</option>
            {box.color.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </SelectField>

          {/* Друк коробки */}
          <SelectField label="Box print" value={form.boxPrint || ""} onChange={(e) => handleChange("boxPrint", e.target.value)}>
            <option value="">-- choose box print --</option>
            {box.print.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </SelectField>

          {/* Execution коробки */}
          <SelectField label="Box execution" value={form.boxExecution || ""} onChange={(e) => handleChange("boxExecution", e.target.value)}>
            <option value="">-- choose box execution --</option>
            {box.execution.map((ex, i) => (
              <option key={i} value={ex}>
                {ex}
              </option>
            ))}
          </SelectField>

          {/* Rolls per carton */}
          <InputField label="Rolls per carton" type="number" value={form.rollsPerCarton || ""} onChange={(e) => handleChange("rollsPerCarton", Number(e.target.value))} />

          {/* Antislide paper sheets */}
          <SelectField label="Antislide paper sheets" value={form.antislidePaperSheets || ""} onChange={(e) => handleChange("antislidePaperSheets", e.target.value)}>
            <option value="">-- choose antislide paper sheets --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </SelectField>

          {/* Carton per pallet */}
          <InputField label="Carton per pallet" type="number" value={form.cartonPerPallet || ""} onChange={(e) => handleChange("cartonPerPallet", Number(e.target.value))} />

          {/* Total order in rolls */}
          <InputField label="Total order in rolls" type="number" value={form.totalOrderInRolls || ""} onChange={(e) => handleChange("totalOrderInRolls", Number(e.target.value))} />

          {/* Total order in pallets */}
          {form.totalOrderInPallets !== undefined && (
            <div className="flex items-center justify-between gap-4 mt-2">
              <p>Total order in pallets</p>
              <p>{form.totalOrderInPallets}</p>
            </div>
          )}

          {/* Період */}
          <InputField label="Period" type="string" value={form.period || ""} onChange={(e) => handleChange("period", e.target.value)} />

          {/* Умови доставки */}
          <SelectField label="Delivery conditions" value={form.deliveryConditions || ""} onChange={(e) => handleChange("deliveryConditions", e.target.value)}>
            <option value="">-- choose delivery conditions --</option>
            {delivery.type.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </SelectField>

          {/* Адреса доставки */}
          <InputField
            label="Delivery address"
            type="string"
            value={form.deliveryAddress || ""}
            onChange={(e) => handleChange("deliveryAddress", e.target.value)}
            disabled={form.deliveryConditions === "EXW" || form.deliveryConditions === "FCA"}
          />

          {/* Reference article */}
          <InputField label="Reference article" type="string" value={form.referenceArticle || ""} onChange={(e) => handleChange("referenceArticle", e.target.value)} required={false} />

          {/* Remarks */}
          <InputField label="Remarks" type="string" value={form.remarks || ""} onChange={(e) => handleChange("remarks", e.target.value)} required={false} />
        </div>

        <div className="flex justify-center gap-5">
            <button type="submit" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
              Create calculation
            </button>
            <button 
              type="button" 
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
              onClick={handleSubmitAndEmail}
            >
              Create calculation and send to email
            </button>
        </div>
      </form>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={async (email) => {
          try {
            await sendEmail(email, newCalculation)
            toast.success("Calculation created and email sent successfully!")
          } catch (error) {
            console.error("Error sending email:", error)
            toast.error("Failed to send email")
          }
        }}
      />

      <ToastContainer />
    </>
  )
}
