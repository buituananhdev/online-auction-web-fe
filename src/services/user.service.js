import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

export const getMe = async () => {
    return await axiosApiInstance.get('/users/me')
}

export const updateProfile = async (data) => {
    return await axiosApiInstance.patch('/users/profile/update-info', data)
}

export const updateAvatar = async (avatar) => {
    return await axiosApiInstance.patch('/users/profile/update-avatar', avatar)
}

export const changePassword = async (data) => {
    return await axiosApiInstance.patch(`/users/profile/change-password`, data)
}

export const getUserInformation = async (id) => {
    return await axiosApiInstance.get(`/users/${id}`)
}
