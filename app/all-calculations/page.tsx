'use client'

import { FilterObject } from "@/components/filter-object"
import { FilterIcon } from "@/icons/FilterIcon"
import { XIcon } from "@/icons/XIcon"
import { Api } from "@/services/api-client"
import { Calculation } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home(){

    const [calculations, setCalculations] = useState<Calculation[]>([])
    const [viewVariant, setViewVariant] = useState<'grid' | 'table'>('grid')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterFields, setFilterFields] = useState<Record<string, string[]>>({})
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [filteredCalculations, setFilteredCalculations] = useState<Calculation[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const hasActiveFilters = Object.values(filters).some(f => f && f !== "All");
    const activeFilterCount = Object.values(filters).filter(
        (v) => v && v !== "All"
    ).length;

    useEffect(() => {
        async function fetchCalculations() {
            try {
                const fetchedCalculations = await Api.calculations.getAll();
                setCalculations(fetchedCalculations);

                const fields: Record<string, Set<string>> = {};

                fetchedCalculations.forEach((calc) => {
                    Object.entries(calc).forEach(([key, value]) => {
                        if (value) {
                            if (!fields[key]) fields[key] = new Set();
                            fields[key].add(String(value));
                        }
                    });
                });

                const formatted: Record<string, string[]> = {};
                for (const key in fields) {
                    formatted[key] = Array.from(fields[key]);
                }

                setFilterFields(formatted);
            } catch (err) {
                console.error(err);
            }
        }

        fetchCalculations();
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    useEffect(() => {
        if (calculations.length === 0) return;

        const filtered = calculations.filter((calc) => {
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (!value || value === "All") return true;
                return String(calc[key as keyof Calculation]) === value;
            });

            const matchesSearch = calc.title.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilters && matchesSearch;
        });

        setFilteredCalculations(filtered);
    }, [filters, calculations, searchQuery]);

    return(
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8 mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-md">
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center sm:text-left">
                            {hasActiveFilters ? (
                                <>
                                    Filtered Calculations
                                    <span className="text-blue-600"> ({filteredCalculations.length})</span>
                                </>
                            ) : (
                                <>
                                    All Calculations
                                    <span className="text-blue-600"> ({calculations.length})</span>
                                </>
                            )}
                        </h1>

                        <div className="w-full sm:w-72 relative">
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-end gap-3">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 h-12 text-sm sm:text-base rounded-lg font-semibold transition duration-200 shadow-md bg-blue-500 text-white hover:bg-blue-600 w-[140px] cursor-pointer"
                        >
                            <FilterIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            {Object.values(filters).some(f => f !== null && f !== '')
                                ? `Filters (${activeFilterCount})`
                                : 'Filters'}
                        </button>

                        <div className="flex items-center space-x-2 p-1 bg-gray-200 rounded-xl">
                            <button
                                onClick={() => setViewVariant('grid')}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewVariant === 'grid'
                                    ? 'bg-white shadow text-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'}`
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewVariant('table')}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewVariant === 'table'
                                    ? 'bg-white shadow text-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'}`
                                }
                                aria-label="Switch to Table View"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {filteredCalculations.length === 0 && (
                    <div className="p-10 bg-white rounded-xl shadow-md">
                        <p className="text-center text-xl text-gray-500 font-medium">
                            {
                                calculations.length === 0 
                                ? "No calculations found currently." 
                                : "No calculations match the current filters. Try clearing them."
                            }
                        </p>
                    </div>
                )}

                {viewVariant === 'table' && filteredCalculations.length > 0 && (
                    <div className="overflow-x-auto shadow-xl rounded-2xl border border-gray-200 bg-white">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-50 text-gray-900 uppercase font-bold border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3">Title</th>
                                    <th className="px-5 py-3">Material</th>
                                    <th className="px-5 py-3">Dimensions</th>
                                    <th className="px-5 py-3">Color</th>
                                    <th className="px-5 py-3">Box Type</th>
                                    <th className="px-5 py-3">Total Rolls</th>
                                    <th className="px-5 py-3">Period</th>
                                    <th className="px-5 py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCalculations.map((calculation, index) => (
                                    <tr
                                        key={calculation.id}
                                        className={`transition-colors ${
                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        } hover:bg-blue-50/50`}
                                    >
                                        <td className="px-5 py-3 font-semibold text-gray-900">
                                            {calculation.title}
                                        </td>
                                        <td className="px-5 py-3">{calculation.material}</td>
                                        <td className="px-5 py-3">
                                            {calculation.material === "Baking paper"
                                            ? `${calculation?.materialWidth} × ${calculation.rollLength} mm`
                                            : `${calculation.materialWidth} × ${calculation.materialLength} × ${calculation.materialThickness} mm`}
                                        </td>
                                        <td className="px-5 py-3">{calculation.materialColor}</td>
                                        <td className="px-5 py-3">{calculation.boxType}</td>
                                        <td className="px-5 py-3 font-mono text-blue-700">{calculation.totalOrderInRolls}</td>
                                        <td className="px-5 py-3">{calculation.period}</td>
                                        <td className="px-5 py-3">
                                            <Link
                                                href={`/calculation/${calculation.id}`}
                                                className="font-bold text-blue-600 hover:text-blue-800 transition underline-offset-2 hover:underline"
                                            >
                                                View →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {viewVariant === 'grid' && filteredCalculations.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCalculations.map((calculation, index) => (
                            <Link
                                href={`/calculation/${calculation.id}`}
                                className="block bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all duration-200 group"
                                key={index}
                            >
                                <h2 className="text-xl font-extrabold mb-2 text-gray-900 group-hover:text-blue-600 transition">
                                    {calculation.title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Material:</span> {calculation.material}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Roll Type:</span> {calculation.roll}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Color:</span> {calculation.materialColor}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Dimensions:</span> {calculation.material === "Baking paper" ? (
                                        `${calculation?.materialWidth} × ${calculation.rollLength} mm`
                                    ) : (
                                        `${calculation.materialWidth} × ${calculation.materialLength} × ${calculation.materialThickness} mm`
                                    )}
                                </p>
                                <p className="text-md font-bold text-blue-700 mt-2 pt-2 border-t border-gray-100">
                                    Total Rolls: {calculation.totalOrderInRolls}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {isFilterOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col relative">
                        <div className="flex items-center justify-between rounded-t-2xl px-6 py-4 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FilterIcon className="w-6 h-6 text-blue-600" />
                                Filters
                            </h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                            >
                                <XIcon className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-8">

                            <FilterObject
                                className="border-t-0"
                                title="Roll type"
                                name="roll"
                                fields={filterFields.roll}
                                selectedValue={filters.roll}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Material"
                                name="material"
                                fields={filterFields.material}
                                selectedValue={filters.material}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Material width"
                                name="materialWidth"
                                fields={filterFields.materialWidth}
                                selectedValue={filters.materialWidth}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Material thickness"
                                name="materialThickness"
                                fields={filterFields.materialThickness}
                                selectedValue={filters.materialThickness}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Material color"
                                name="materialColor"
                                fields={filterFields.materialColor}
                                selectedValue={filters.materialColor}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Other properties"
                                name="otherProperties"
                                fields={filterFields.otherProperties}
                                selectedValue={filters.otherProperties}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Skillet format"
                                name="skilletFormat"
                                fields={filterFields.skilletFormat}
                                selectedValue={filters.skilletFormat}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Skillet knife"
                                name="skilletKnife"
                                fields={filterFields.skilletKnife}
                                selectedValue={filters.skilletKnife}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Skillet density"
                                name="skilletDensity"
                                fields={filterFields.skilletDensity}
                                selectedValue={filters.skilletDensity}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Box type"
                                name="boxType"
                                fields={filterFields.boxType}
                                selectedValue={filters.boxType}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Box color"
                                name="boxColor"
                                fields={filterFields.boxColor}
                                selectedValue={filters.boxColor}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Box print"
                                name="boxPrint"
                                fields={filterFields.boxPrint}
                                selectedValue={filters.boxPrint}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Box Execution"
                                name="boxExecution"
                                fields={filterFields.boxExecution}
                                selectedValue={filters.boxExecution}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Antislide paper sheets"
                                name="antislidePaperSheets"
                                fields={filterFields.antislidePaperSheets}
                                selectedValue={filters.antislidePaperSheets}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Period"
                                name="period"
                                fields={filterFields.period}
                                selectedValue={filters.period}
                                onChange={handleFilterChange}
                            />

                            <FilterObject
                                title="Delivery conditions"
                                name="deliveryConditions"
                                fields={filterFields.deliveryConditions}
                                selectedValue={filters.deliveryConditions}
                                onChange={handleFilterChange}
                            />

                        </div>

                        <div className="px-6 py-4 border-t rounded-b-2xl bg-white sticky bottom-0 flex justify-between gap-4 z-10">
                            <button
                                onClick={() => setFilters({})}
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-medium transition cursor-pointer"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md transition cursor-pointer"
                            >
                                Apply ({filteredCalculations.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}