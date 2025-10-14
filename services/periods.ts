import { MaterialProperty, Period } from "@prisma/client"
import { ApiRoutes } from "./constants"
import { axiosInstance } from "./instance"

export const getAll = async (): Promise<Period[]> => {

    const { data } = await axiosInstance.get<Period[]>(ApiRoutes.PERIODS)

    return data

}

export const update = async (id: number, data: string): Promise<Period> => {
    const res = await axiosInstance.patch<Period>(`${ApiRoutes.PERIODS}/${id}`, data)

    return res.data
}

export const find = async (filters: {
    period: string,
    material: string,
}): Promise<MaterialProperty> => {
    const params = new URLSearchParams()
    params.append("period", filters.period)
    params.append("material", filters.material)

    const { data } = await axiosInstance.get<MaterialProperty>(`${ApiRoutes.PERIODS}/find?${params.toString()}`)

    return data
}