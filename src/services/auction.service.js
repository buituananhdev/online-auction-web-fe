import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL
export const getListAuctions = async (
    page = 1,
    pageSize = 10,
    searchQuery = '',
    condition = '',
    minCurrentPrice = '',
    maxCurrentPrice = '',
    minEndTime='',
    maxEndTime='',
    minMaxPrice = '',
    maxMaxPrice = ''
) => {
    //&searchQuery=1231&condition=1&minCurrentPrice=122&maxCurrentPrice=1234&minMaxPrice=12345&maxMaxPrice=123456&minEndTime=2024-05-07T14%3A56%3A00.000Z&maxEndTime=2024-05-15T14%3A56%3A00.000Z'
    let url = `/auctions?pageNumber=${page}&pageSize=${pageSize}`
    if(searchQuery) {
        url += `&searchQuery=${searchQuery}`
    }
    if(condition) {
        url += `&condition=${condition}`
    }
    if(minMaxPrice) {
        url += `&minMaxPrice=${minMaxPrice}`
    } 
    if(maxMaxPrice) {
        url += `&maxMaxPrice=${maxMaxPrice}`
    } 
    if(minCurrentPrice) {
        url += `&minCurrentPrice=${minCurrentPrice}`
    } 
    if(maxCurrentPrice) {
        url += `&maxCurrentPrice=${maxCurrentPrice}`
    } 
    if(minEndTime) {
        url += `&minEndTime=${minEndTime.toISOString()}`
    } 
    if(maxEndTime) {
        url += `&maxEndTime=${maxEndTime.toISOString()}`
    } 
    return await axiosApiInstance.get(url)
}

export const getSingleAuction = async (id) => {
    return await axiosApiInstance.get(`/auctions/${id}`)
}

export const addAuction = async (data) => {
    return await axiosApiInstance.post('/auctions', data)
}

export const updateAuction = async (id, data) => {
    return await axiosApiInstance.put(`/autions/${id}`, data)
}

export const deleteAuction = async (id) => {
    return axiosApiInstance.delete(`/auctions/${id}`)
}