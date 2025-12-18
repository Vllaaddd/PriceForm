import { FC } from "react";

interface Props{
    label: string,
    unit?: string,
    value: string | number | null | undefined,
    isCurrency?: boolean
}

export const Info: FC<Props> = ({ label, unit, value, isCurrency = false }) => {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="group flex flex-col sm:grid sm:grid-cols-12 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors px-3 -mx-3 rounded-lg">
      <div className="sm:col-span-5 text-sm font-medium text-gray-500 mb-1 sm:mb-0 flex items-center">
        {label}
      </div>

      <div className="hidden sm:flex sm:col-span-3 items-center justify-center">
        {unit && (
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">
                {unit}
            </span>
        )}
      </div>

      <div className="sm:col-span-4 font-semibold text-gray-900 sm:text-right flex items-center justify-between sm:justify-end gap-2">
        <span className="text-base">
            {isCurrency && <span className="text-gray-400 font-normal mr-1">€</span>}
            {value}
        </span>
        {unit && <span className="sm:hidden text-xs text-gray-400 font-medium">{unit}</span>}
      </div>
    </div>
  );
};