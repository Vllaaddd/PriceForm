'use client'

import { FilterObject } from "@/components/filter-object"
import { FilterIcon } from "@/icons/FilterIcon"
import { XIcon } from "@/icons/XIcon"
import { Api } from "@/services/api-client"
import { Calculation } from "@prisma/client"
import { Box, Calendar, ChevronRight, Eye, Layers, Package, Palette, Plus, Ruler, SearchX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home(){

    const [calculations, setCalculations] = useState<Calculation[]>([])
    const [viewVariant, setViewVariant] = useState<'grid' | 'table'>('table')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterFields, setFilterFields] = useState<Record<string, string[]>>({})
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [filteredCalculations, setFilteredCalculations] = useState<Calculation[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading , setIsLoading] = useState(true);

    const hasActiveFilters = Object.values(filters).some(f => f && f !== "All");
    const activeFilterCount = Object.values(filters).filter(
        (v) => v && v !== "All"
    ).length;

    const router = useRouter()

    useEffect(() => {
        async function fetchCalculations() {
            try {
                const fetchedCalculations = await Api.calculations.getAll();
                setCalculations(fetchedCalculations.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }));

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
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
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
                
                <div className="flex flex-col max-w-6xl lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-8 mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-md">
                    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4">
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

                    <div className="flex items-center justify-center lg:justify-end gap-3">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 h-12 text-sm sm:text-base rounded-lg font-semibold transition duration-200 shadow-md bg-blue-500 text-white hover:bg-blue-600 w-[140px] cursor-pointer"
                        >
                            <FilterIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            {Object.values(filters).some(f => f !== null && f !== '')
                                ? `Filters (${activeFilterCount})`
                                : 'Filters'
                            }
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

                {filteredCalculations.length === 0 && hasActiveFilters && (
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
                    <div className="w-full max-w-6xl mx-auto">
                        <div className="overflow-x-auto pb-4">
                            <table className="min-w-full text-sm text-left border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                                        <th className="px-5 pb-2">Calculation Info</th>
                                        <th className="px-5 pb-2">Details</th>
                                        <th className="px-5 pb-2">Properties</th>
                                        <th className="px-5 pb-2 text-center">Volume</th>
                                        <th className="px-5 pb-2 text-right"></th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-600">
                                    {filteredCalculations.map((calculation) => (
                                        <tr
                                            key={calculation.id}
                                            onClick={() => router.push(`/calculation/${calculation.id}`)}
                                            className="bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group rounded-xl cursor-pointer"
                                        >
                                            <td className="px-5 py-4 rounded-l-xl border-l-4 border-transparent group-hover:border-blue-500 transition-colors bg-white">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                        {calculation.title}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(calculation.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 bg-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                        <Layers className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">
                                                            {calculation.material}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {calculation.materialColor}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 bg-white">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors"></span>
                                                        {calculation.material !== "Baking paper"
                                                            ? `${calculation.materialWidth} mm × ${calculation.materialLength} m  × ${calculation.materialThickness} my`
                                                            : calculation.material === 'Baking paper' && calculation.typeOfProduct === 'Consumer sheets'
                                                               ? `${calculation?.sheetWidth} mm × ${calculation.sheetLength} mm`
                                                               : `${calculation?.materialWidth} mm × ${calculation.rollLength} m`
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Box className="w-3 h-3" />
                                                        {calculation.boxType}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 bg-white text-center">
                                                <div className="inline-flex flex-col items-center justify-center px-4 py-1.5 rounded-lg bg-gray-50 border border-gray-100 group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all">
                                                    <span className="text-lg font-bold text-gray-900 leading-none">
                                                        {calculation.totalOrderInRolls.toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-semibold text-gray-400">
                                                        Rolls
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 rounded-r-xl bg-white text-right">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all duration-200">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {viewVariant === 'grid' && filteredCalculations.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                        {filteredCalculations.map((calculation, index) => (
                            <Link
                                href={`/calculation/${calculation.id}`}
                                key={index}
                                className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0" />

                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {calculation.title}
                                            </h2>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(calculation.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 rounded-md bg-gray-100 text-xs font-semibold text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            {calculation.material.split(' ')[0]}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 flex-1">
                                        
                                        <div className="flex items-start gap-2">
                                            <Layers className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-400 font-medium">Material</span>
                                                <span className="text-sm font-medium text-gray-700 leading-tight">{calculation.material}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Box className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-400 font-medium">Type</span>
                                                <span className="text-sm font-medium text-gray-700 leading-tight">{calculation.roll}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Palette className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-400 font-medium">Color</span>
                                                <span className="text-sm font-medium text-gray-700 leading-tight">{calculation.materialColor}</span>
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-start gap-2 bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                                            <Ruler className="w-4 h-4 text-blue-500 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-gray-400 font-medium">Dimensions</span>
                                                <span className="text-sm font-semibold text-gray-800 leading-tight">
                                                    {calculation.material !== "Baking paper"
                                                        ? `${calculation.materialWidth}mm × ${calculation.materialLength}m × ${calculation.materialThickness}my`
                                                        : calculation.typeOfProduct === 'Consumer sheets'
                                                            ? `${calculation?.sheetWidth}mm × ${calculation.sheetLength}mm`
                                                            : `${calculation?.materialWidth}mm × ${calculation.rollLength}m`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500">Total Volume</span>
                                        <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
                                            <Package className="w-4 h-4" />
                                            <span className="text-sm font-bold">
                                                {calculation.totalOrderInRolls.toLocaleString()} Rolls
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            {isFilterOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl shrink-0 z-20">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FilterIcon className="w-5 h-5 text-blue-600" />
                                    Refine Results
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select properties to filter calculations
                                </p>
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 bg-gray-50"> 
                            <div className="h-full grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                
                                <div className="md:col-span-4 lg:col-span-3 overflow-y-auto h-full custom-scrollbar bg-white relative">
                        
                                    <div className="sticky top-0 bg-white z-10 px-5 py-3 border-b border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-900">
                                            Main Properties
                                        </h3>
                                    </div>

                                    <div className="px-5 pb-5 pt-4 space-y-6">
                                        <FilterObject
                                            title="Roll Type"
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
                                            title="Color"
                                            name="materialColor"
                                            fields={filterFields.materialColor}
                                            selectedValue={filters.materialColor}
                                            onChange={handleFilterChange}
                                        />

                                        <div className="pt-4 mt-4 border-t border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Dimensions</h4>
                                            <div className="space-y-4">
                                                <FilterObject
                                                    title="Width"
                                                    name="materialWidth"
                                                    fields={filterFields.materialWidth}
                                                    selectedValue={filters.materialWidth}
                                                    onChange={handleFilterChange}
                                                />
                                                <FilterObject
                                                    title="Thickness"
                                                    name="materialThickness"
                                                    fields={filterFields.materialThickness}
                                                    selectedValue={filters.materialThickness}
                                                    onChange={handleFilterChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-8 lg:col-span-9 overflow-y-auto h-full custom-scrollbar bg-gray-50/50 relative">
                        
                                    <div className="sticky top-0 bg-gray-50 z-10 px-5 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-bold text-gray-900">
                                            Additional Details
                                        </h3>
                                    </div>

                                    <div className="px-5 pb-5 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">

                                        <FilterObject
                                            title="Other properties"
                                            name="otherProperties"
                                            fields={filterFields.otherProperties}
                                            selectedValue={filters.otherProperties}
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
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl shrink-0 z-20 flex justify-between gap-4">
                            <button
                                onClick={() => setFilters({})}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-300 font-medium transition shadow-sm cursor-pointer"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition cursor-pointer"
                            >
                                Show {filteredCalculations.length} {filteredCalculations.length === 1 ? 'Result' : 'Results'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="w-full max-w-6xl mx-auto space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                            key={i} 
                            className="w-full h-20 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between animate-pulse"
                        >
                            <div className="flex items-center gap-6 w-full">
                                <div className="w-12 h-12 bg-gray-100 rounded-full shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/4 bg-gray-100 rounded" />
                                    <div className="h-3 w-1/3 bg-gray-50 rounded" />
                                </div>
                                <div className="hidden sm:block h-8 w-24 bg-gray-100 rounded-lg shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {calculations.length === 0 && !isLoading && !hasActiveFilters && (
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
                        
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <SearchX className="w-10 h-10 text-blue-500" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No calculations found
                        </h3>
                        
                        <p className="text-gray-500 max-w-sm mb-8 text-lg">
                            It looks like you haven't created any price calculations yet. 
                            Start by adding your first material calculation.
                        </p>

                        <Link 
                            href='/' 
                            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Create new calculation
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}