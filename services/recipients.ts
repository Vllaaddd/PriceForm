import { EmailRecipient } from "@prisma/client"
import { ApiRoutes } from "./constants"
import { axiosInstance } from "./instance"

export const getAll = async (): Promise<EmailRecipient[]> => {

    const { data } = await axiosInstance.get(ApiRoutes.RECIPIENTS)

    return data

}