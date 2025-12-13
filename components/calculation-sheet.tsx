import { cn } from "@/lib/utils";
import { Calculation } from "@prisma/client";
import { FC } from "react";

type Props = {
    data: Calculation;
}

export const CalculationSheet: FC<Props> = ({ data }) => {

  const rows = [
    { label: "Width", unit: "mm", val: data.materialWidth, decimals: 3 },
    { label: data.roll === 'BP' ? "Density" : 'Thickness', unit: "my", val: data.materialThickness || data.density, decimals: 3 },
    { label: "Length", unit: "m", val: data.materialLength || data.rollLength, decimals: 3 },
    { label: "Weight", unit: "kg", val: data.materialWeight, decimals: 3 },
    { label: "Folienpreis", unit: "EUR/kg", val: data.foliePricePerKg, decimals: 3 },
    { label: "UK-Inhalt", unit: "ME/UK", val: data.rollsPerCarton, decimals: 3 },
    { label: "Palette (UK)", unit: "UK/PA", val: data.cartonPerPallet, decimals: 3 },
    { label: "Palette (ME)", unit: "ME/PA", val: data.rollsPerCarton * data.cartonPerPallet, decimals: 1 },
    
    { type: "separator"},
    
    { label: "Folie", unit: "EUR", val: data.materialCost, decimals: 3 },
    { label: "Core", unit: "EUR", val: data.roll === 'BP' ? null : data.corePrice, decimals: 3 },
    { label: "Skillet", unit: "EUR", val: data.skilletPrice, decimals: 3 },
    { label: "Umkarton", unit: "EUR", val: data.umkartonPrice, decimals: 3 },
    { label: "Zw/ потім", unit: "EUR", val: null, decimals: 3 },
    { label: "W&V", unit: "EUR", val: data.WVPerRoll, decimals: 3 },
    { label: "FORA Zusch", unit: "%", val: data.margin, decimals: 3 },
    { label: "EXW/ потім", unit: "EUR", val: null, decimals: 3 },
    { label: "Lagerkoste/ потім", unit: "EUR", val: null, decimals: 3 },
    
    { type: "separator"},
    
    {label: "Preis", unit: "EUR", val: data.totalPricePerRoll, decimals: 3, isTotal: true },
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
        <div className="col-span-4 pl-2">Description</div>
        <div className="col-span-2 text-center">Unit</div>
        <div className="col-span-2 text-right pr-4">Value</div>
      </div>

      <div>
        {rows.map((row, i) => {
          if (row.type === "separator") {
            return (
               <div key={i} className="flex items-center text-gray-400 py-1">
                 <div className="flex-1 border-t border-dashed border-gray-300 mr-4"></div>
               </div>
            )
          }

          if (row.val !== null && row.val !== undefined) {
            return (
              <div
                key={i}
                className={cn(
                  "grid grid-cols-12 py-1 hover:bg-blue-50 transition-colors",
                  row.isTotal ? "bg-gray-100 font-bold text-gray-900 border-t border-gray-200 py-2" : "text-gray-700"
                )}
              >
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
          }
        })}
      </div>
    </div>
  )
}