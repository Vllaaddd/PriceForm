'use client';
import { useEffect, useState } from 'react';
import { Api } from '@/services/api-client';
import { Line, MaterialProperty } from '@prisma/client';
import { LineTable } from './line-table';
import { MaterialPropertiesTable } from './material-properties-table';

export const AdminDashboard = () => {
    const [lines, setLines] = useState<Line[]>([]);
    const [materialProperties, setMaterialProperties] = useState<MaterialProperty[]>([]);
    const [mainLines, setMainLines] = useState<Line[]>([]);
    const [bpLines, setBpLines] = useState<Line[]>([]);
    const [speedLine1, setSpeedLine1] = useState<Line[]>([]);
    const [speedLine2, setSpeedLine2] = useState<Line[]>([]);

    useEffect(() => {
        async function fetchData() {
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
            setMainLines(filteredMainLines)
            
            const filteredBPLines = allLines
            .filter((line) => line.lineType === "BP lines")
            .sort((a, b) => a.length - b.length);
            
            setBpLines(filteredBPLines);
            
            const filteredSpeedLine1 = allLines
            .filter((line) => line.lineType === "Speed 4,5 and 4,6")
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
            
            setSpeedLine1(filteredSpeedLine1);
            
            const filteredSpeedLine2 = allLines
            .filter((line) => line.lineType === "Speed 6,4")
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

            setSpeedLine2(filteredSpeedLine2);

            const allMaterialProperties = await Api.properties.getAll();
            setMaterialProperties(allMaterialProperties.sort((a, b) => {
                if (a.material === "Alu") return -1;
                if (b.material === "Alu") return 1;
                if (a.material === "PE") return -1;
                if (b.material === "PE") return 1;
                return 0;
            }));       
        }

        fetchData();
    }, []);

  return (
    <div className='min-h-screen flex items-start justify-center bg-gray-200 p-4 pb-10'>
        <div className="p-4 text-center">

            {mainLines?.length > 0 ? (
                <LineTable lines={mainLines} title='Av speed main lines' />
            ) : (
                <p className='pb-5'>Loading main lines...</p>
            )}

            {bpLines?.length > 0 ? (
                <LineTable lines={bpLines} title='Av speed bp lines' />
            ) : (
                <p className='pb-5'>Loading bp lines...</p>
            )}

            {speedLine1?.length > 0 ? (
                <LineTable lines={speedLine1} title='Av speed line 4,5 and 4,6' />
            ) : (
                <p className='pb-5'>Loading speed line 4,5 and 4,6...</p>
            )}

            {speedLine2?.length > 0 ? (
                <LineTable lines={speedLine2} title='Av speed line 6,4' />
            ) : (
                <p className='pb-5'>Loading speed line 6,4...</p>
            )}

            {speedLine2?.length > 0 ? (
                <MaterialPropertiesTable materials={materialProperties as any} title='Material properties' />
            ) : (
                <p className='pb-5'>Loading material properties...</p>
            )}

        </div>
    </div>
  );
};
