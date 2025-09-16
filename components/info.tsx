import { FC } from "react";

interface Props{
    label: string;
    value: string | number;
}

export const Info: FC<Props> = ({ label, value }) => {
    return(
        <div className="flex flex-col border-b pb-2">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value || "-"}</span>
        </div>
    )
}