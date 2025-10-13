import { Core } from "@prisma/client"
import { ApiRoutes } from "./constants"
import { axiosInstance } from "./instance"

export const getAll = async (): Promise<Core[]> => {

    const { data } = await axiosInstance.get<Core[]>(ApiRoutes.CORES)

    return data

}

export const find = async (filters: {
    length: number;
    type: string;
}): Promise<Core> => {
    const params = new URLSearchParams();
    params.append("length", String(filters.length));
    params.append("type", String(filters.type));

    const { data } = await axiosInstance.get<Core>(`${ApiRoutes.CORES}/find?${params.toString()}`);
    return data;
};
