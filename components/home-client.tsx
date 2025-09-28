'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calculation } from '@prisma/client';
import { MaterialChoice } from '@/components/material-choice';
import { Api } from '@/services/api-client';

type Roll = {
  name: string;
  materials: Material[];
};

type Material = {
  name: string;
  width?: number[];
  thickness?: number[];
  density?: number[];
  typeOfProduct?: string[];
  color?: string[];
  otherProperties?: string[];
  id: number;
};

type Skillet = {
  format: string[];
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
  rolls: Roll[];
  skillet: Skillet;
  box: Box;
  delivery: Delivery;
  lochstanzlinge: string[];
};

export default function HomeClient({ rolls, skillet, box, delivery, lochstanzlinge }: Props) {
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
                rolls={rolls}
                skillet={skillet}
                box={box}
                delivery={delivery}
                initialCalculation={initialCalculation}
                lochstanzlinge={lochstanzlinge}
            />
        </div>
    </div>
    
  );
}