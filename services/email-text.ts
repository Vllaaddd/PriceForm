import { EmailText } from "@prisma/client"
import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"

export const getText = async (): Promise<EmailText> => {

    const { data } = await axiosInstance.get<EmailText>(ApiRoutes.EMAILTEXT)

    return data
}