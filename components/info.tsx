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
    <div className="flex flex-col sm:grid sm:grid-cols-12 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2">
      <div className="sm:col-span-5 text-gray-600 font-medium mb-1 sm:mb-0">
        {label}
      </div>

      <div className="hidden sm:block sm:col-span-3 text-center text-gray-400 text-sm select-none">
        {unit || "-"}
      </div>

      <div className="sm:col-span-4 font-semibold text-gray-900 sm:text-right">
        {isCurrency ? "€ " : ""}{value}
        <span className="sm:hidden text-gray-500 font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
};