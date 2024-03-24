import axiosApiInstance from '../plugins/api'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL
export const getListCategories = async (page = 1,  pageSize = 10) => {
    const url = `/categories?pageNumber=${page}&pageSize=${pageSize}`
    return await axiosApiInstance.get(url)
}

export const getSingleCategory = async (id) => {
    return await axiosApiInstance.get(`/categories/${id}`)
}

export const addCategory = async (data) => {
    return await axiosApiInstance.post('/categories',data)
}

export const updateCategory = async (id, data) => {
    return await axiosApiInstance.put(`/autions/${id}`, data)
}

export const deleteCategory = async (id) => {
    return axiosApiInstance.delete(`/categories/${id}`)
}