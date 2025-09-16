import { FC } from "react";

interface InputFieldProps{
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
    type: string;
}

export const InputField: FC<InputFieldProps> = ({ label, onChange, value, type }) => {
    return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={true}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}