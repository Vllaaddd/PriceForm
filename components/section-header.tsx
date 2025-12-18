import { FC, ReactNode } from "react";

type Props = {
    title: string;
    icon?: ReactNode;
}

export const SectionHeader: FC<Props> = ({ title, icon }) => (
  <div className="flex items-center gap-3 mt-10 mb-4 pb-2 border-b border-gray-100">
    {icon && (
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            {icon}
        </div>
    )}
    <h3 className="text-lg font-bold text-gray-800 tracking-tight">
        {title}
    </h3>
  </div>
);