import { FC, ReactNode } from "react";

interface SelectFieldProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: ReactNode;
    disabled?: boolean;
    required?: boolean;
}

export const SelectField: FC<SelectFieldProps> = ({
    label,
    value,
    onChange,
    children,
    disabled = false,
    required = true
}) => {
    return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "bg-white border-gray-300"
        }`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      >
        {children}
      </select>
    </div>
  );
};
