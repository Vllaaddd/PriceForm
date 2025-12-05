import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"

export const sendEmail = async (email: string, calculation: any, type: string, text: string): Promise<void> => {
  await axiosInstance.post(ApiRoutes.EMAILS, { email, calculation, type, text })
}