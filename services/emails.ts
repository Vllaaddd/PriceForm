import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constants"

export const sendEmail = async (email: string, calculation: any): Promise<void> => {
  await axiosInstance.post(ApiRoutes.EMAILS, { email, calculation })
}