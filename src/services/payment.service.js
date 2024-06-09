import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

export const postPayment = async (data) => {
    return await axiosApiInstance.post('/payments',data)
}
