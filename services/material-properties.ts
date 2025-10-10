import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"
import { MaterialProperty } from "@prisma/client"

export const getAll = async (): Promise<MaterialProperty[]> => {

    const { data } = await axiosInstance.get<MaterialProperty[]>(ApiRoutes.PROPERTIES)

    return data

}

export const update = async (id: number, data: Partial<MaterialProperty>): Promise<MaterialProperty[]> => {

    const res = await axiosInstance.patch<MaterialProperty[]>(`${ApiRoutes.PROPERTIES}/${id}`, data)

    return res.data

}