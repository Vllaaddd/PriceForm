import { UmkartonWithPrices } from "@/prisma/types";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const find = async (filters: {
    fsDimension: number;
    displayCarton: string;
    width: number;
    bedoManu: string;
}): Promise<UmkartonWithPrices> => {
    const params = new URLSearchParams();
    params.append("fsDimension", String(filters.fsDimension));
    params.append("displayCarton", filters.displayCarton);
    params.append("width", String(filters.width));
    params.append("bedoManu", String(filters.bedoManu));

    const { data } = await axiosInstance.get<UmkartonWithPrices>(`${ApiRoutes.UMKARTONS}/find?${params.toString()}`);
    return data;
};