'use client'

import { FC, FormEvent, useEffect, useState } from "react"
import { SelectField } from "./select-field"
import { InputField } from "./input-field"
import { Api } from "@/services/api-client"
import { EmailModal } from "./email-modal"
import { sendEmail } from "@/services/emails"

type CalculationForm = {
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
  referenceArticle?: string
  remarks?: string
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

  const handleChange = (field: keyof CalculationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { id, createdAt, updatedAt, ...cleanForm } = form as any
    await Api.calculations.createCalculation(cleanForm)
    setForm({})
  }

  const handleSubmitAndEmail = async (e: FormEvent) => {
    e.preventDefault()
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

  return (
    <>
      <form
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Конфігурація замовлення
        </h2>

        <div className="grid gap-4">
          {/* Назва */}
          <InputField label="Назва" type="string" value={form.title || ""} onChange={(e) => handleChange("title", e.target.value)} />

          {/* Матеріал */}
          <SelectField label="Матеріал" value={form.material || ""} onChange={(e) => handleChange("material", e.target.value)}>
            <option value="">-- виберіть матеріал --</option>
            {materials.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </SelectField>

          {/* Ширина */}
          <SelectField
            label="Ширина (mm)"
            value={form.materialWidth || ""}
            onChange={(e) => handleChange("materialWidth", Number(e.target.value))}
            disabled={!selectedMaterial}
          >
            <option value="">-- виберіть ширину --</option>
            {selectedMaterial?.width.map((w, i) => (
              <option key={i} value={w}>
                {w}
              </option>
            ))}
          </SelectField>

          {/* Товщина */}
          <SelectField
            label="Товщина (my)"
            value={form.materialThickness || ""}
            onChange={(e) => handleChange("materialThickness", Number(e.target.value))}
            disabled={!selectedMaterial}
          >
            <option value="">-- виберіть товщину --</option>
            {selectedMaterial?.thickness.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </SelectField>

          {/* Довжина */}
          <InputField label="Довжина (m)" type="number" value={form.materialLength || ""} onChange={(e) => handleChange("materialLength", Number(e.target.value))} />

          {/* Колір */}
          <SelectField
            label="Колір"
            value={form.materialColor || ""}
            onChange={(e) => handleChange("materialColor", e.target.value)}
            disabled={!selectedMaterial}
          >
            <option value="">-- виберіть колір --</option>
            {selectedMaterial?.color.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </SelectField>

          {/* Інші властивості */}
          <SelectField
            label="Інші властивості"
            value={form.otherProperties || ""}
            onChange={(e) => handleChange("otherProperties", e.target.value)}
            disabled={!selectedMaterial}
          >
            <option value="">-- виберіть інші властивості --</option>
            {selectedMaterial?.otherProperties.map((o, i) => (
              <option key={i} value={o}>
                {o}
              </option>
            ))}
          </SelectField>

          {/* Skillet */}
          <SelectField label="Skillet format" value={form.skilletFormat || ""} onChange={(e) => handleChange("skilletFormat", Number(e.target.value))}>
            <option value="">-- виберіть skillet format --</option>
            {skillet.format.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </SelectField>

          {/* Skillet knife */}
          <SelectField label="Skillet knife" value={form.skilletKnife || ""} onChange={(e) => handleChange("skilletKnife", e.target.value)}>
            <option value="">-- виберіть skillet knife --</option>
            {skillet.knife.map((k, i) => (
              <option key={i} value={k}>
                {k}
              </option>
            ))}
          </SelectField>

          {/* Skillet density */}
          <SelectField label="Skillet density" value={form.skilletDensity || ""} onChange={(e) => handleChange("skilletDensity", Number(e.target.value))}>
            <option value="">-- виберіть skillet density --</option>
            {skillet.density.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </SelectField>

          {/* Box */}
          <SelectField label="Тип коробки" value={form.boxType || ""} onChange={(e) => handleChange("boxType", e.target.value)}>
            <option value="">-- виберіть тип коробки --</option>
            {box.type.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </SelectField>

          {/* Колір коробки */}
          <SelectField label="Колір коробки" value={form.boxColor || ""} onChange={(e) => handleChange("boxColor", e.target.value)}>
            <option value="">-- виберіть колір коробки --</option>
            {box.color.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </SelectField>

          {/* Друк коробки */}
          <SelectField label="Друк коробки" value={form.boxPrint || ""} onChange={(e) => handleChange("boxPrint", e.target.value)}>
            <option value="">-- виберіть друк коробки --</option>
            {box.print.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </SelectField>

          {/* Execution коробки */}
          <SelectField label="Execution коробки" value={form.boxExecution || ""} onChange={(e) => handleChange("boxExecution", e.target.value)}>
            <option value="">-- виберіть execution коробки --</option>
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
            <option value="">-- виберіть --</option>
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
          <InputField label="Період" type="string" value={form.period || ""} onChange={(e) => handleChange("period", e.target.value)} />

          {/* Умови доставки */}
          <SelectField label="Умови доставки" value={form.deliveryConditions || ""} onChange={(e) => handleChange("deliveryConditions", e.target.value)}>
            <option value="">-- виберіть умови доставки --</option>
            {delivery.type.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </SelectField>

          {/* Адреса доставки */}
          <InputField label="Адреса доставки" type="string" value={form.deliveryAddress || ""} onChange={(e) => handleChange("deliveryAddress", e.target.value)} />

          {/* Reference article */}
          <InputField label="Reference article" type="string" value={form.referenceArticle || ""} onChange={(e) => handleChange("referenceArticle", e.target.value)} />

          {/* Remarks */}
          <InputField label="Remarks" type="string" value={form.remarks || ""} onChange={(e) => handleChange("remarks", e.target.value)} />
        </div>

        <div className="flex justify-center gap-5">
            <button type="submit" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
              Створити розрахунок
            </button>
            <button 
              type="submit" 
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
              onClick={handleSubmitAndEmail}
            >
              Створити розрахунок і відправити на email
            </button>
        </div>
      </form>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={(email) => sendEmail(email, newCalculation)}
      />
    </>
  )
}
