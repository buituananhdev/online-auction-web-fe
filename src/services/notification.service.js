import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

export const getNotificationList = async () => {
    return await axiosApiInstance.get('/notifications')
}

export const readNotification = async (id) => {
    return await axiosApiInstance.patch(`/notifications/${id}/read`)
}