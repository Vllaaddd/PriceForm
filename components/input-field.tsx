import { FC } from "react";

interface InputFieldProps{
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
    type: string;
    required?: boolean;
    disabled?: boolean;
    max?: number;
}

export const InputField: FC<InputFieldProps> = ({ label, onChange, value, type, required = true, disabled = false, max }) => {
    return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        max={max}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "bg-white border-gray-300"
        }`}
      />
    </div>
  );
}