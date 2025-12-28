import { Line } from "@prisma/client"
import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"

export const getAll = async (): Promise<Line[]> => {

    const { data } = await axiosInstance.get<Line[]>(ApiRoutes.LINES)

    return data

}

export const getOne = async (id: string): Promise<Line> => {

    const { data } = await axiosInstance.get<Line>(`${ApiRoutes.LINES}/${id}`)

    return data

}

export const update = async (id: number, data: Partial<Line>): Promise<Line[]> => {

    const res = await axiosInstance.patch<Line[]>(`${ApiRoutes.LINES}/${id}`, data)

    return res.data

}

export const find = async (filters: {
    material: string;
    lineType: string;
    length: number;
    width: number;
}): Promise<Line> => {
    const params = new URLSearchParams();
    params.append("material", filters.material);
    params.append("lineType", filters.lineType);
    params.append("length", String(filters.length));
    params.append("width", String(filters.width));

    const { data } = await axiosInstance.get<Line>(`${ApiRoutes.LINES}/find?${params.toString()}`);
    return data;
};
