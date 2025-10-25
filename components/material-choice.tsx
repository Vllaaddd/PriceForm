'use client';

import { FC, FormEvent, useEffect, useState } from "react"
import { SelectField } from "./select-field"
import { InputField } from "./input-field"
import { Api } from "@/services/api-client"
import { EmailModal } from "./email-modal"
import { sendEmail } from "@/services/emails"
import { ToastContainer, toast } from 'react-toastify';
import Swal from "sweetalert2";
import { Period } from "@prisma/client";

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
  skilletFormat?: string | null
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
  format: string[]
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

  useEffect(() => {

    const fetchRecipients = async () => {

      try {
        const recipients = await Api.recipients.getAll()
        setEmails(recipients.map(r => r.email))
      } catch (error) {
        console.error(error)
      }

    }

    fetchRecipients()

  }, [])

  const selectedRoll = rolls.find(r => r.name === form.roll)
  const selectedMaterial = selectedRoll?.materials.find(m => m.name === form.material)
  
  useEffect(() => {

    const fetchPeriods = async () => {

      const periods = await Api.periods.getAll()
      setPeriods(periods)

    }

    fetchPeriods()

  }, [])

  const handleChange = (field: keyof CalculationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const fetchLine = async (material: string, materialLength: number, lineType: string) => {
    const line = await Api.lines.find({
      material: material,
      lineType: lineType,
      length: materialLength || 0
    });


    const { id } = line

    const processingTime = Number(materialLength) / line.avSpeed;
    const newValuePerRoll = processingTime * line.costPerMin;
    await Api.lines.update(id, { rollLength: String(materialLength), processingTime, valuePerRoll: newValuePerRoll } )
    
    const updatedLine = await Api.lines.getOne(String(id))
    return Number(updatedLine.valuePerRoll)
  }

  const createForm = async (form: CalculationForm) => {
    let materialCost = 0
    let WVPerRoll = 0
    let materialName = undefined

    const { material, materialWidth, materialThickness, materialLength, roll, rollLength, sheetLength, sheetWidth, sheetQuantity, typeOfProduct, skilletFormat, skilletKnife, skilletDensity, totalOrderInRolls, period  } = form
    if(material === 'Baking paper'){
      materialName = 'BP'
    }else{
      materialName = material
    }

    const { density, costPerKg } = await Api.periods.find({
      period: period || "",
      material: materialName || "",
    })

    if (materialWidth && materialThickness && materialLength && density && material !== 'BP') {
      const materialWeight = materialWidth * materialThickness * materialLength * Number(density) / 1000000
      materialCost = materialWeight * Number(costPerKg)
    }else{
      if(typeOfProduct !== 'Consumer sheets' && materialWidth && rollLength && form.density){
        const square = (materialWidth / 1000) * Number(rollLength)
        const materialWeight = square * form.density
        materialCost = (materialWeight / 1000) * Number(costPerKg)
      }else if (typeOfProduct === 'Consumer sheets' && sheetLength && sheetWidth && sheetQuantity && form.density) {
        const square = Number(sheetWidth) * Number(sheetLength) * sheetQuantity
        const materialWeight = square * form.density
        materialCost = (materialWeight / 1000) * Number(costPerKg)
      }
    }

    if(roll === 'Consumer' && materialWidth && materialWidth <= 350){
      if (material === 'PE' || material === 'PVC') {
        WVPerRoll = await fetchLine('Frischhaltefolie', materialLength || 0, 'Main lines');
      } else {
        WVPerRoll = await fetchLine('Alu', materialLength || 0, 'Main lines');
      }
    }else if(roll === 'Consumer' && materialWidth && materialWidth > 350){
      if (material === 'PE' || material === 'PVC') {
        WVPerRoll = await fetchLine('Frischhaltefolie', materialLength || 0, 'Speed 6,4');
      } else {
        WVPerRoll = await fetchLine('Alu', materialLength || 0, 'Speed 6,4');
      }
    }else if(roll === 'Catering'){
      if (material === 'PE' || material === 'PVC') {
        WVPerRoll = await fetchLine('Frischhaltefolie', materialLength || 0, 'Speed 4,5 and 4,6');
      } else {
        WVPerRoll = await fetchLine('Alu', materialLength || 0, 'Speed 4,5 and 4,6');
      }
    }else if(roll === 'BP' && typeOfProduct !== 'Consumer sheets' && rollLength && Number(rollLength) <=52){
      WVPerRoll = await fetchLine('BP', Number(rollLength) || 0, 'BP lines')
    }else if(roll === 'BP' && typeOfProduct === 'Consumer sheets' && sheetLength && sheetWidth && sheetQuantity){

      let length = 0;

      if(sheetLength > sheetWidth){
        length = Number(sheetLength) * sheetQuantity
      }else{
        length = Number(sheetWidth) * sheetQuantity
      }

      if(length <= 52){
        WVPerRoll = await fetchLine('BP', length, 'BP lines')
      }else{
        WVPerRoll = 0
      }

    }else if(roll === 'BP' && rollLength && Number(rollLength) > 52){
      WVPerRoll = 0
    }

    const skillet = await Api.skillets.find({
      format: Number(skilletFormat),
      knife: skilletKnife || '',
      density: Number(skilletDensity)
    })

    const skilletName = skillet.article;
    let skilletPrice = 0;

    if(totalOrderInRolls && totalOrderInRolls > 30000 && totalOrderInRolls <= 200000){
      skilletPrice = skillet.smallPrice
    }else if(totalOrderInRolls && totalOrderInRolls > 200000 && totalOrderInRolls <= 500000){
      skilletPrice = skillet.mediumPrice
    }else if(totalOrderInRolls && totalOrderInRolls > 500000 && totalOrderInRolls <= 1000000){
      skilletPrice = skillet.largePrice
    }

    const core = await Api.cores.find({ length: materialWidth || 0, type: roll || '' })
    
    let coreName = `Hülse ${core.length} x ${core.width} x ${core.thickness} mm`
    let corePrice = core.price;

    if(core.type === 'No suitable core found'){
      coreName = 'No suitable core found'
    }
    
    if(material === 'Baking paper'){
      coreName = '-'
      corePrice = 0
    }

    const totalPricePerRoll = Number(materialCost) + Number(WVPerRoll) + Number(skilletPrice) + Number(corePrice)
    const totalPrice = totalPricePerRoll * (totalOrderInRolls || 0)

    return { materialCost, WVPerRoll, skilletPrice, skillet: skilletName, corePrice, core: coreName, totalPricePerRoll, totalPrice }
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
        confirmButtonText: "Save",
      }).then( async (result) => {
        if (result.isConfirmed) {
          await Api.calculations.createCalculation({ ...cleanForm, ...props })
          emails?.map(email => {
            sendEmail(email, cleanForm)
          })
          setForm({})
          setIsLoading(false)
          toast.success('Calculation created!')
        } else if (result.isDenied) {
          setIsLoading(false)
          return
        }
      });
    }

    if(props.core === "No suitable core found" && props.skillet === "This type of skillet isn't available"){
      swalFire("This type of skillet isn't available and no suitable core found.")
      return
    }else if(props.core === "No suitable core found"){
      swalFire("No suitable core found.")
      return
    }else if(props.skillet === "This type of skillet isn't available"){
      swalFire("This type of skillet isn't available.")
      return
    }

    await Api.calculations.createCalculation({ ...cleanForm, ...props })
    emails?.map(email => {
      sendEmail(email, cleanForm)
    })
    setForm({})
    setIsLoading(false)
    toast.success('Calculation created!')
    
  }

  const handleSubmitAndEmail = async (e: FormEvent) => {
    e.preventDefault()
    const formEl = e.target as HTMLFormElement
    setIsLoading(true)

    if (!formEl.closest("form")?.checkValidity()) {
      formEl.closest("form")?.reportValidity()
      return
    }

    const { id, createdAt, updatedAt, ...cleanForm } = form as any

    const props = await createForm(cleanForm)

    const swalFire = (msg: string) => {
      Swal.fire({
        title: `${msg} Do you want to create calculation?`,
        showDenyButton: true,
        denyButtonColor: 'red',
        confirmButtonText: "Save",
      }).then( async (result) => {
        if (result.isConfirmed) {
          const created = await Api.calculations.createCalculation({ ...cleanForm, ...props })
          setNewCalculation(created)
          setIsModalOpen(true)
          setForm({})
          setIsLoading(false)
        } else if (result.isDenied) {
          setIsModalOpen(false)
          setIsLoading(false)
          return
        }
      });
    }

    if(props.core === "No suitable core found" && props.skillet === "This type of skillet isn't available"){
      swalFire("This type of skillet isn't available and no suitable core found.")
      return
    }else if(props.core === "No suitable core found"){
      swalFire("No suitable core found.")
      return
    }else if(props.skillet === "This type of skillet isn't available"){
      swalFire("This type of skillet isn't available.")
      return
    }

    const created = await Api.calculations.createCalculation({ ...cleanForm, ...props })
    setNewCalculation(created)
    setIsModalOpen(true)
    setForm({})
    setIsLoading(false)
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
      setForm(prev => ({ ...prev, deliveryAddress: "Singen" }))
    } else if (form.deliveryConditions === "DDP" || form.deliveryConditions === "DAP") {
      setForm(prev => ({ ...prev, deliveryAddress: "" }))
    }
  }, [form.deliveryConditions])

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
          <InputField label="Creator (your email)" type="email" value={form.creator || ""} onChange={(e) => handleChange("creator", e.target.value)} />

          {/* Roll */}
          <SelectField label="Roll type" value={form.roll || ""} onChange={(e) => handleChange("roll", e.target.value)}>
            <option value="">-- choose roll type --</option>
            {rolls.map((r, i) => (
              <option key={i} value={r.name}>
                {r.name}
              </option>
            ))}
          </SelectField>

          {/* Матеріал */}
          {selectedRoll && (
            <SelectField label="Material" value={form.material || ""} onChange={(e) => handleChange("material", e.target.value)}>
              <option value="">-- choose material --</option>
              {selectedRoll.materials.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </SelectField>
          )}

          {/* Ширина */}
          <SelectField
            label="Width (mm)"
            value={form.materialWidth || ""}
            onChange={(e) => handleChange("materialWidth", Number(e.target.value))}
            disabled={!selectedMaterial}
          >
            <option value="">-- choose width --</option>
            {selectedMaterial?.width?.map((w, i) => (
              <option key={i} value={w}>
                {w}
              </option>
            ))}
          </SelectField>

          {selectedMaterial?.name !== 'Baking paper' && (
            <>
              {/* Товщина */}
              <SelectField
                label="Thickness (my)"
                value={form.materialThickness || ""}
                onChange={(e) => handleChange("materialThickness", Number(e.target.value))}
                disabled={!selectedMaterial}
              >
                <option value="">-- choose thickness --</option>
                {selectedMaterial?.thickness?.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </SelectField>

              {/* Довжина */}
              <InputField label="Length (m)" type="number" value={form.materialLength || ""} onChange={(e) => handleChange("materialLength", Number(e.target.value))} />
            </>
          )}

          {selectedMaterial?.name === 'Baking paper' && (
            <>
              {/* Density */}
              <SelectField
                label="Density (g/m²)"
                value={form.density || ""}
                onChange={(e) => handleChange("density", Number(e.target.value))}
                disabled={!selectedMaterial}
              >
                <option value="">-- choose density --</option>
                {selectedMaterial?.density?.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </SelectField>

              {/* Type of product */}
              <SelectField
                label="Type of product"
                value={form.typeOfProduct || ""}
                onChange={(e) => handleChange("typeOfProduct", e.target.value)}
                disabled={!selectedMaterial}
              >
                <option value="">-- choose type of product --</option>
                {selectedMaterial?.typeOfProduct?.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </SelectField>
            </>
          )}
          { (form.typeOfProduct === 'Consumer sheets' && form.material === 'Baking paper') && (
            <>
              {/* Sheet width */}
              <InputField
                label="Sheet width(m)"
                type="string"
                value={form.sheetWidth || ""}
                onChange={(e) => handleChange("sheetWidth", e.target.value)}
              />

              {/* Sheet length */}
              <InputField
                label="Sheet length(m)"
                type="string"
                value={form.sheetLength || ""}
                onChange={(e) => handleChange("sheetLength", e.target.value)}
              />

              {/* Sheet quantity */}
              <InputField
                label="Sheet quantity (max 30)"
                type="number"
                max={30}
                value={form.sheetQuantity || ""}
                onChange={(e) => handleChange("sheetQuantity", Number(e.target.value))}
              />
            </>
          )}
          {(form.typeOfProduct === 'Consumer roll' || form.typeOfProduct === 'Catering roll'  && form.material === 'Baking paper') && (
            <>
              {/* Roll length */}
              <InputField
                label="Roll length(m)"
                type="string" value={form.rollLength || ""}
                onChange={(e) => handleChange("rollLength", e.target.value)}
              />
            </>
          )}

          {/* Колір */}
          <SelectField
            label={selectedRoll?.name === 'BP' ? 'Paper color' : 'Color'}
            value={form.materialColor || ""}
            onChange={(e) => handleChange("materialColor", e.target.value)}
            disabled={!selectedMaterial}
          >
            <option value="">-- choose color --</option>
            {selectedMaterial?.color?.map((c, i) => (
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
            {selectedMaterial?.otherProperties?.map((o, i) => (
              <option key={i} value={o}>
                {o}
              </option>
            ))}
          </SelectField>

          {/* Skillet format */}
          <SelectField label="Skillet format" value={form.skilletFormat || ""} onChange={(e) => handleChange("skilletFormat", String(e.target.value))}>
            <option value="">-- choose skillet format --</option>
            {(() => {
              let formats: string[] = skillet.format;

              if (selectedRoll?.name === "BP") {
                formats = skillet.format.slice(4, 8);
              } else if (selectedRoll?.name === "Catering") {
                formats = skillet.format.slice(7, 9);
              } else {
                formats = skillet.format.slice(0, 4);
              }

              return formats.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ));
            })()}
          </SelectField>

          {/* Skillet knife */}
          <SelectField
            label="Skillet knife"
            value={form.skilletKnife || ""}
            onChange={(e) => handleChange("skilletKnife", e.target.value)}
          >
            <option value="">-- choose skillet knife --</option>
            {(
              selectedRoll?.name === "BP"
                ? [skillet.knife[0], ...skillet.knife.slice(-3)]
                : selectedRoll?.name === "Catering"
                ? [skillet.knife[0], ...skillet.knife.slice(-2)]
                : skillet.knife.slice(0, 5)
            ).map((k, i) => (
              <option key={i} value={k}>
                {k}
              </option>
            ))}
          </SelectField>

          {selectedRoll?.name === "Catering" ?
            <>
              {/* Lochstanzlinge */}
                <SelectField label="Lochstanzlinge" value={form.lochstanzlinge || ""} onChange={(e) => handleChange("lochstanzlinge", e.target.value)}>
                  <option value="">-- choose lochstanzlinge --</option>
                  {lochstanzlinge.map((l, i) => (
                    <option key={i} value={l}>
                      {l}
                    </option>
                  ))}
                </SelectField>
            </>
          : (
            <>
              {/* Skillet density */}
              <SelectField label="Skillet density" value={form.skilletDensity || ""} onChange={(e) => handleChange("skilletDensity", Number(e.target.value))}>
                <option value="">-- choose skillet density --</option>
                {skillet.density.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </SelectField>
            </>
          )}

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
            {(selectedRoll?.name === "BP" 
                ? box.print.slice(0, -1)
                : box.print
            ).map((p, i) => (
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
          <SelectField label="Period" value={form.period || ""} onChange={(e) => handleChange("period", e.target.value)}>
            <option value="">-- choose delivery conditions --</option>
            {periods?.map((period, i) => (
              <option key={i} value={period.period}>
                {period.period}
              </option>
            ))}
          </SelectField>

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
            {isLoading ? 'Processing...' : 'Create calculation'}
          </button>
          <button 
            type="button" 
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            onClick={handleSubmitAndEmail}
          >
            {isLoading ? 'Processing...' : 'Create calculation and send to email'}
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
