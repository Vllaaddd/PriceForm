import { FC } from "react";
import { Check } from "lucide-react";

type Props = {
    title: string;
    name: string;
    fields: string[];
    selectedValue: string;
    onChange: (key: string, value: string) => void;
    className?: string;
};

export const FilterObject: FC<Props> = ({ title, name, fields, selectedValue, onChange, className }) => {
    const isAllSelected = !selectedValue || selectedValue === "All";

    return (
        <div className={`flex flex-col gap-2 ${className || ""}`}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {title}
            </p>
            
            <div className="grid grid-cols-2 gap-2">
                <label className="relative group cursor-pointer w-full">
                    <input
                        type="radio"
                        name={name}
                        className="peer sr-only"
                        value=""
                        checked={isAllSelected}
                        onChange={() => onChange(name, 'All')}
                    />
                    <span className={`
                        flex items-center justify-center text-center gap-2 px-2 py-2 rounded-lg text-sm font-medium border w-full h-full transition-all duration-200
                        ${isAllSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                        }
                    `}>
                        {isAllSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        <span className="truncate">All</span>
                    </span>
                </label>

                {fields?.map((v) => {
                    const isSelected = selectedValue === v;
                    return (
                        <label key={v} className="relative group cursor-pointer w-full">
                            <input
                                type="radio"
                                name={name}
                                className="peer sr-only"
                                value={v}
                                checked={isSelected}
                                onChange={(e) => onChange(name, String(e.target.value))}
                            />
                            <span className={`
                                flex items-center justify-center text-center gap-2 px-2 py-2 rounded-lg text-sm font-medium border w-full h-full transition-all duration-200 select-none
                                ${isSelected 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                }
                            `}>
                                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                <span className="truncate">{v}</span>
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};