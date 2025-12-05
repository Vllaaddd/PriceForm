import { Skillet } from "@prisma/client"
import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"
import { SkilletWithPrices } from "@/prisma/types"

export const getAll = async (): Promise<SkilletWithPrices[]> => {

    const { data } = await axiosInstance.get<SkilletWithPrices[]>(ApiRoutes.SKILLETS)

    return data

}

export const getOne = async (id: string): Promise<SkilletWithPrices> => {

    const { data } = await axiosInstance.get<SkilletWithPrices>(`${ApiRoutes.SKILLETS}/${id}`)

    return data

}

export const find = async (filters: {
    width: number;
    height: number;
    knife: string;
    density: number;
}): Promise<SkilletWithPrices> => {
    const params = new URLSearchParams();
    params.append("width", String(filters.width));
    params.append("height", String(filters.height));
    params.append("knife", filters.knife);
    params.append("density", String(filters.density));

    const { data } = await axiosInstance.get<SkilletWithPrices>(`${ApiRoutes.SKILLETS}/find?${params.toString()}`);
    return data;
};