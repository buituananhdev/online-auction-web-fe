import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

export const getMe = async () => {
    return await axiosApiInstance.get('/users/me')
}

export const updateProfile = async (id, data) => {
    return await axiosApiInstance.put(`/users/${id}`, data)
}

export const changePassword = async (id, data) => {
    return await axiosApiInstance.patch(`/users/${id}/change-password`, data)
}

