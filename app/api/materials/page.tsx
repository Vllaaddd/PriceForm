'use client'

import { MaterialPropertiesTable } from "@/components/material-properties-table";
import { Api } from "@/services/api-client";
import { MaterialProperty } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home(){
  
  const [materialProperties, setMaterialProperties] = useState<MaterialProperty[]>([]);

  useEffect(() => {
    async function fetchData() {
        
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


  return(
    <div className='min-h-screen flex items-start justify-center bg-gray-200 p-4 pb-10'>
      <div className="p-4 text-center">
        {materialProperties?.length > 0 ? (
          <MaterialPropertiesTable materials={materialProperties as any} title='Material properties' />
        ) : (
          <p className='pb-5'>Loading material properties...</p>
        )}
      </div>
    </div>
  )
}