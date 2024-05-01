import axiosApiInstance from '../plugins/api'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

export const getWatchlist = async (page = 1, pageSize = 10, searchQuery = '', type = '') => {
    let url = `/watchlist?pageNumber=${page}&pageSize=${pageSize}`
    if(searchQuery) {
        url += `&searchQuery=${searchQuery}`
    }
    if(type) {
        url += `&type=${type}`
    }
    return axiosApiInstance.get(url)
}

export const addWatchlist = async (data) => {
    return await axiosApiInstance.post('/watchlist', data)
}