'use client';

import HomeClient from "@/components/home-client";
import { Suspense } from "react";

export default function Page() {
  const materials = [
    {
      name: 'Alu',
      width: [288, 290, 294, 295, 298, 300, 327, 330],
      thickness: [8, 9, 10, 10.3, 10.5, 10.7, 11, 11.2, 11.3, 11.5, 12, 12.3, 12.5, 13, 13.2, 13.3, 13.5, 14, 14.5, 15, 15.5, 17, 17.5, 18, 20],
      color: ['Silver'],
      otherProperties: ['Embossed', '-'],
      id: 1,
    },
    {
      name: 'Pe',
      width: [290, 295, 300],
      thickness: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13.5, 14, 14.5],
      color: ['Transparent'],
      otherProperties: ['SuperStretch', 'Easy Tear'],
      id: 2,
    },
    {
      name: 'Pvc',
      width: [290, 295, 300, 350],
      thickness: [6, 6.5, 7, 7.5, 8, 8.5, 9, 10, 10.2],
      color: ['Transparent', 'Champagne', 'Yellow'],
      otherProperties: ['Factor 1', 'Factor 2', 'Factor 3'],
      id: 3,
    },
  ];

  const skillet = {
    format: [39, 45, 50, 52],
    knife: ['No knife', 'Paper knife', 'Straight plastic knife', 'V-type plastic knife', 'U-type plastic knife'],
    density: [275, 350, 375, 400],
  };

  const box = {
    type: ['With cover', 'Without cover'],
    color: ['Brown', 'White'],
    print: ['Printed', 'Not printer', 'Printed and varnished'],
    execution: ['With perforation', 'Without perforation'],
  };

  const delivery = {
    type: ['EXW', 'FCA', 'DAP', 'DDP'],
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
        <HomeClient materials={materials} skillet={skillet} box={box} delivery={delivery} />
      </div>
    </Suspense>
  )
}
