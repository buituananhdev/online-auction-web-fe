import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

export const getMe = async () => {
    return await axiosApiInstance.get('/users/me')
}

