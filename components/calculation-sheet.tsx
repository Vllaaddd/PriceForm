import { cn } from "@/lib/utils";
import { Calculation } from "@prisma/client";
import { FC } from "react";

type Props = {
    data: Calculation;
}

export const CalculationSheet: FC<Props> = ({ data }) => {

  const rows = [
    { code: "02", label: "Breite", unit: "mm", val: data.materialWidth, decimals: 3 },
    { code: "03", label: "Dicke", unit: "my", val: data.materialThickness || data.density, decimals: 3 },
    { code: "04", label: "Länge", unit: "m", val: data.materialLength || data.rollLength, decimals: 3 },
    { code: "09", label: "Gewicht, kalk.", unit: "kg", val: data.materialWeight, decimals: 3 },
    { code: "10", label: "Folienpreis", unit: "EUR/kg", val: 0, decimals: 3 },
    { code: "15", label: "UK-Inhalt", unit: "ME/UK", val: data.rollsPerCarton, decimals: 3 },
    { code: "16", label: "Palette (UK)", unit: "UK/PA", val: data.cartonPerPallet, decimals: 3 },
    { code: "17", label: "Palette (ME)", unit: "ME/PA", val: data.rollsPerCarton * data.cartonPerPallet, decimals: 1 },
    
    { type: "separator", code: "49" },
    
    { code: "50", label: "FO/0 Folie", unit: "EUR", val: data.materialCost, decimals: 3 },
    { code: "50", label: "++/0 Hülse", unit: "EUR", val: data.corePrice, decimals: 3 },
    { code: "50", label: "++/0 FS", unit: "EUR", val: data.skilletPrice, decimals: 3 },
    { code: "50", label: "UK/0 Umkarton", unit: "EUR", val: data.umkartonPrice, decimals: 3 },
    { code: "50", label: "PA/0 A Zw", unit: "EUR", val: 0.000, decimals: 3 },
    { code: "50", label: "++/0 W&V", unit: "EUR", val: data.WVPerRoll, decimals: 3 },
    { code: "50", label: "**/0 FORA Zusch", unit: "(Faktor)", val: 1.050, decimals: 3 },
    { code: "50", label: "PA/1 EXW", unit: "EUR", val: null, decimals: 3 },
    { code: "50", label: "PA/2 Lagerkoste", unit: "EUR", val: 0.016, decimals: 3 },
    
    { type: "separator", code: "51" },
    
    { code: "70", label: "Preis, kalk.", unit: "EUR", val: data.totalPricePerRoll, decimals: 3, isTotal: true },
    { code: "71", label: "Preis", unit: "EUR", val: data.totalPricePerRoll, decimals: 3, isTotal: true },
  ];

  const formatDe = (val: number | null | undefined, decimals: number = 3) => {
    if (val === null || val === undefined) return "-";
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  return (
    <div className="border border-gray-300 bg-white shadow-sm font-mono text-sm">
      <div className="grid grid-cols-12 bg-gray-100 border-b border-gray-300 py-2 font-bold text-gray-700">
        <div className="col-span-1 text-center">--</div>
        <div className="col-span-4 pl-2">Description</div>
        <div className="col-span-2 text-center">Unit</div>
        <div className="col-span-2 text-right pr-4">Value</div>
      </div>

      <div>
        {rows.map((row, i) => {
          if (row.type === "separator") {
            return (
               <div key={i} className="flex items-center text-gray-400 py-1">
                 <span className="w-10 text-center text-xs">{row.code}</span>
                 <div className="flex-1 border-t border-dashed border-gray-300 mr-4"></div>
               </div>
            )
          }

          return (
            <div 
              key={i}
              className={cn(
                "grid grid-cols-12 py-1 hover:bg-blue-50 transition-colors",
                row.isTotal ? "bg-gray-100 font-bold text-gray-900 border-t border-gray-200 py-2" : "text-gray-700"
              )}
            >
              <div className="col-span-1 text-center text-gray-400 text-xs select-none pt-0.5">
                {row.code}
              </div>
              <div className="col-span-4 pl-2 truncate">
                {row.label}
              </div>
              <div className="col-span-2 text-center text-gray-500 text-xs pt-0.5">
                {row.unit}
              </div>
              <div className="col-span-2 text-right pr-4 font-medium tabular-nums text-black">
                {formatDe(Number(row.val), row.decimals)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}