'use client';
import { useEffect, useState } from 'react';
import { Api } from '@/services/api-client';
import { Line } from '@prisma/client';

export const AdminDashboard = () => {
    const [lines, setLines] = useState<Line[]>([]);
    const [mainLines, setMainLines] = useState<Line[]>([]);
    const [bpLines, setBpLines] = useState<Line[]>([]);
    const [rollLengths, setRollLengths] = useState<Record<number, number>>({});

    useEffect(() => {
        async function fetchLines() {
            const allLines = await Api.lines.getAll();
            setLines(allLines);

            const filteredMainLines = allLines
                .filter((line) => line.lineType === "Main lines")
                .sort((a, b) => {
                    if (a.materialType === b.materialType) {
                        return a.length - b.length;
                    }
                    if (a.materialType === "Alu") return -1;
                    if (b.materialType === "Alu") return 1;
                    if (a.materialType === "Frischhaltefolie") return -1;
                    if (b.materialType === "Frischhaltefolie") return 1;
                    return 0;
                });
            setMainLines(filteredMainLines);

            const filteredBPLines = allLines
                .filter((line) => line.lineType === "BP lines")
                .sort((a, b) => a.length - b.length);

            setBpLines(filteredBPLines);
        }

        fetchLines();
    }, []);

    const handleRollLengthChange = async (id: number, value: number) => {
        setRollLengths((prev) => ({
            ...prev,
            [id]: value,
        }));

        await Api.lines.update(id, { rollLength: value });
    };

  return (
    <div className='min-h-screen flex items-start justify-center bg-gray-200 p-4 pb-10'>
        <div className="p-4 text-center">

            {mainLines?.length > 0 ? (
                <div className='mb-16'>
                    <h1 className="text-xl font-bold mb-4">Av speed main lines</h1>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2">Material type</th>
                                <th className="border px-3 py-2">Length</th>
                                <th className="border px-3 py-2">Total duration</th>
                                <th className="border px-3 py-2">Total meters</th>
                                <th className="border px-3 py-2">AV speed</th>
                                <th className="border px-3 py-2">Roll length</th>
                                <th className="border px-3 py-2">Processing time in mins</th>
                                <th className="border px-3 py-2">Mashine & LabourCost for 1 min</th>
                                <th className="border px-3 py-2">Value per roll</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mainLines?.map((line) => {

                                const currentRollLength = rollLengths[line.id] ?? line.rollLength;
                                const processingTime = currentRollLength / line.avSpeed;
                                const valuePerRoll = processingTime * line.costPerMin;

                                return (
                                    <tr key={line.id}>
                                        <td className="border px-3 py-2">{line.materialType}</td>
                                        <td className="border px-3 py-2">{line.length}</td>
                                        <td className="border px-3 py-2">{line.totalDuration}</td>
                                        <td className="border px-3 py-2">{line.totalMeters}</td>
                                        <td className="border px-3 py-2">{line.avSpeed}</td>
                                        <td className="border px-3 py-2">
                                            <input
                                                type="string"
                                                value={rollLengths[line.id] ?? line.rollLength ?? ''}
                                                onChange={(e) =>
                                                    handleRollLengthChange(line.id, Number(e.target.value))
                                                }
                                                className="w-24 p-1 border rounded"
                                            />
                                        </td>
                                        <td className="border px-3 py-2">{processingTime.toFixed(3)}</td>
                                        <td className="border px-3 py-2">{line.costPerMin.toFixed(3)}</td>
                                        <td className="border px-3 py-2">{valuePerRoll.toFixed(3)}</td>
                                    </tr>
                                )})}
                        </tbody>
                    </table>
                </div>
                ) : (
                    <p>No main lines available.</p>
            )}

            {bpLines?.length > 0 ? (
                <>
                    <h1 className="text-xl font-bold mb-4">Av speed bp lines</h1>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2">Material type</th>
                                <th className="border px-3 py-2">Length</th>
                                <th className="border px-3 py-2">Total duration</th>
                                <th className="border px-3 py-2">Total meters</th>
                                <th className="border px-3 py-2">AV speed</th>
                                <th className="border px-3 py-2">Roll length</th>
                                <th className="border px-3 py-2">Processing time in mins</th>
                                <th className="border px-3 py-2">Mashine & LabourCost for 1 min</th>
                                <th className="border px-3 py-2">Value per roll</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bpLines?.map((line) => {

                                const currentRollLength = rollLengths[line.id] ?? line.rollLength;
                                const processingTime = currentRollLength / line.avSpeed;
                                const valuePerRoll = processingTime * line.costPerMin;

                                return (
                                    <tr key={line.id}>
                                        <td className="border px-3 py-2">{line.materialType}</td>
                                        <td className="border px-3 py-2">{line.length}</td>
                                        <td className="border px-3 py-2">{line.totalDuration}</td>
                                        <td className="border px-3 py-2">{line.totalMeters}</td>
                                        <td className="border px-3 py-2">{line.avSpeed}</td>
                                        <td className="border px-3 py-2">
                                            <input
                                                type="string"
                                                value={rollLengths[line.id] ?? line.rollLength ?? ''}
                                                onChange={(e) =>
                                                    handleRollLengthChange(line.id, Number(e.target.value))
                                                }
                                                className="w-24 p-1 border rounded"
                                            />
                                        </td>
                                        <td className="border px-3 py-2">{processingTime.toFixed(3)}</td>
                                        <td className="border px-3 py-2">{line.costPerMin.toFixed(3)}</td>
                                        <td className="border px-3 py-2">{valuePerRoll.toFixed(3)}</td>
                                    </tr>
                                )})}
                        </tbody>
                    </table>
                </>
                ) : (
                    <p>No bp lines available.</p>
            )}
        </div>
    </div>
  );
};
