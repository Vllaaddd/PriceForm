'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculation } from '@prisma/client';
import { MaterialChoice } from '@/components/material-choice';
import { Api } from '@/services/api-client';

type Material = {
  name: string;
  width: number[];
  thickness: number[];
  color: string[];
  otherProperties: string[];
  id: number;
};

type Skillet = {
  format: number[];
  knife: string[];
  density: number[];
};

type Box = {
  type: string[];
  color: string[];
  print: string[];
  execution: string[];
};

type Delivery = {
  type: string[];
};

type Props = {
  materials: Material[];
  skillet: Skillet;
  box: Box;
  delivery: Delivery;
};

export default function HomeClient({ materials, skillet, box, delivery }: Props) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const [initialCalculation, setInitialCalculation] = useState<Calculation | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (from) {
        try {
          const calculation = await Api.calculations.getOneCalculation(from);
          setInitialCalculation(calculation);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [from]);

  return (
    <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-t-2xl shadow-md">
            Price Form
        </h1>
        <div className="bg-white rounded-b-2xl shadow-lg p-6">
            <MaterialChoice
                materials={materials}
                skillet={skillet}
                box={box}
                delivery={delivery}
                initialCalculation={initialCalculation}
            />
        </div>
    </div>
    
  );
}