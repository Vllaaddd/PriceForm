import { Api } from "@/services/api-client";
import { FC, useState } from "react";

type Material = {
    id: number;
    material: string;
    density?: string;
    costPerKg: string;
}

interface Props{
    materials: Material[];
    title: string
}

export const MaterialPropertiesTable: FC<Props> = ({ materials, title }) => {

    const [costPerKg, setCostPerKg] = useState<Record<number, string>>({});

    const handleCostPerKgChange = async (id: number, costPerKg: string) => {
    
        setCostPerKg((prev) => ({
            ...prev,
            [id]: costPerKg,
        }));

        await Api.properties.update(id, { costPerKg });
    };

    return(
        <div className="pb-10">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                Material properties
            </h1>

            <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-900 uppercase font-medium">
                        <tr>
                            <th className="px-5 py-3 text-center">Material</th>
                            <th className="px-5 py-3 text-center">Density</th>
                            <th className="px-5 py-3 text-center">Cost per kg</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {materials?.map((material, index) => (
                            <tr
                                key={material.id}
                                className={`transition-colors ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-blue-50`}
                            >
                                <td className="px-5 py-3 text-center font-medium text-gray-900">
                                    {material.material}
                                </td>
                                {material.density ? (
                                    <td className="px-5 py-3 text-center">{material.density}</td>
                                ) : (
                                    <td className="px-5 py-3 text-center">-</td>
                                )}
                                <td className="px-5 py-3 text-center">
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={costPerKg[material.id] ?? material.costPerKg ?? ""}
                                        onChange={(e) =>
                                        handleCostPerKgChange(
                                            material.id,
                                            e.target.value.replace(",", ".")
                                        )
                                        }
                                        className="w-24 p-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}