import { Line } from "@prisma/client"
import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"

export const getAll = async (): Promise<Line[]> => {

    const { data } = await axiosInstance.get<Line[]>(ApiRoutes.LINES)

    return data

}

export const update = async (id: number, data: Partial<Line>): Promise<Line[]> => {

    const res = await axiosInstance.patch<Line[]>(`${ApiRoutes.LINES}/${id}`, data)

    return res.data

}

