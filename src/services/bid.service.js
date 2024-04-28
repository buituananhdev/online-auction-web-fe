import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL
export const getListOfBids = async (page = 1,  pageSize = 10) => {
    const url = `/bids?pageNumber=${page}&pageSize=${pageSize}`
    return await axiosApiInstance.get(url)
}

export const bidAuction = async (data) => {
    return await axiosApiInstance.post('/bids',data)
}
