import { FC } from "react";

type Props = {
    title: string;
    name: string;
    fields: string[];
    selectedValue: string;
    onChange: (key: string, value: string) => void;
    className?: string;
};

export const FilterObject: FC<Props> = ({ title, name, fields, selectedValue, onChange, className }) => {
    return(
        <div className={`border-t pt-5 ${className || ""}`}>
            <p className="text-lg font-semibold text-gray-800 mb-3">{title}</p>
            <div className="space-y-2 pl-1">
                <label
                    className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 px-2 py-1.5 rounded-lg transition"
                >
                    <input
                        type="radio"
                        name={name}
                        className="w-5 h-5 accent-blue-600"
                        value=""
                        checked={!selectedValue || selectedValue === "All"}
                        onChange={() => onChange(name, 'All')}
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">All</span>
                </label>
                {fields.map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 px-2 py-1.5 rounded-lg transition">
                        <input
                            type="radio"
                            name={name}
                            className="w-5 h-5 accent-blue-600"
                            value={v}
                            checked={selectedValue === v}
                            onChange={(e) => onChange(name, String(e.target.value))} />
                        <span className="text-gray-700 group-hover:text-gray-900">{v}</span>
                    </label>
                ))}
            </div>
        </div>
    )    
}