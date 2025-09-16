import { Calculation } from "@prisma/client"
import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"

export const getAll = async (): Promise<Calculation[]> => {

    const { data } = await axiosInstance.get<Calculation[]>(ApiRoutes.CALCULATIONS)

    return data

}

export const getOneCalculation = async (id: string): Promise<Calculation> => {
    const { data } = await axiosInstance.get<Calculation>(`${ApiRoutes.CALCULATIONS}/${id}`)

    return data
}

export const search = async (query: string): Promise<Calculation[]> => {

    const { data } = await axiosInstance.get<Calculation[]>(ApiRoutes.CALCULATIONS, { params: {query} })

    return data

}

export const createCalculation = async (req: Partial<Calculation>): Promise<Calculation> => {

    const { data } = await axiosInstance.post<Calculation>(ApiRoutes.CALCULATIONS, req)

    return data

}