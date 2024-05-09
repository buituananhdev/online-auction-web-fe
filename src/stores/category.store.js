import { defineStore } from 'pinia'
import { getListCategories } from '../services/category.service';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categoryList: [],
        currentCategoryId: null
    }),
    actions: {
        setCurrentCategoryId(id) {
            this.currentCategoryId = id
        },
        async getCategoryList() {
            try {
                const res = await getListCategories(1, 20)
                this.categoryList = res.data.data
            } catch (error) {
                console.error(error);
            }
        },
    },
})
