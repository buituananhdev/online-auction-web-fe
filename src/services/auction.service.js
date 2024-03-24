import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL
export const getListAuctions = async (page = 1,  pageSize = 10) => {
    const url = `/auctions?pageNumber=${page}&pageSize=${pageSize}`
    return await axiosApiInstance.get(url)
}

export const getSingleAuction = async (id) => {
    return await axiosApiInstance.get(`/auctions/${id}`)
}

export const addAuction = async (data) => {
    return await axiosApiInstance.post('/auctions',data)
}

export const updateAuction = async (id, data) => {
    return await axiosApiInstance.put(`/autions/${id}`, data)
}

export const deleteAuction = async (id) => {
    return axiosApiInstance.delete(`/auctions/${id}`)
}