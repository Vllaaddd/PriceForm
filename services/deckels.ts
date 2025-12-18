import { Deckel } from "@prisma/client"
import { ApiRoutes } from "./constants"
import { axiosInstance } from "./instance"

export const getAll = async (): Promise<Deckel[]> => {

    const { data } = await axiosInstance.get<Deckel[]>(ApiRoutes.DECKELS)

    return data

}

export const update = async (id: number, data: any): Promise<Deckel> => {

    const res = await axiosInstance.patch(`${ApiRoutes.DECKELS}/${id}`, data)

    return res.data

}

export const updateByArticle = async (article: string, data: any): Promise<Deckel[]> => {

    const res = await axiosInstance.patch(`${ApiRoutes.DECKELS}/by-article/${article}`, data)

    return res.data

}

export const create = async(data: any): Promise<Deckel> => {
    
    const res = await axiosInstance.post(ApiRoutes.DECKELS, data)

    return res.data
    
}

export const deleteDeckel = async(id: string): Promise<Deckel> => {

    const { data } = await axiosInstance.delete(`${ApiRoutes.DECKELS}/${id}`)

    return data

}

export const find = async (filters: {
    article: string;
}): Promise<Deckel> => {
    const params = new URLSearchParams();
    params.append("article", String(filters.article));

    const { data } = await axiosInstance.get<Deckel>(`${ApiRoutes.DECKELS}/find?${params.toString()}`);
    return data;
};