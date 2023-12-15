import axios from 'axios'
import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from "./user.js"
import { useToast } from "vue-toastification"

export const useCategoriesStore = defineStore('categories', () => {

    const userStore = useUserStore()

    const socket = inject("socket")

    const toast = useToast()

    const categories = ref([])

    const totalCategories = computed(() => {
        return categories.value.length
    })

    const totalDebitCategories = computed(() => {
        return categories.value.filter( cat =>
            cat.type == 'D')
    })

    const totalCreditCategories = computed(() => {
        return categories.value.filter( cat =>
            cat.type == 'C')
    })

    function getCategoriesByFilter(type, name) {
        return categories.value.filter( cat =>
            (!type || type == cat.type ) &&
            (!name || cat.name.includes(name))
        )
    }

    function getCategoriessByFilterTotal(type, name) {
        return categories.value.reduce((acumulador, cat) =>
            ((!type || type == cat.type ) &&
            (!name || name in cat.name ))
                ? acumulador + 1
                : acumulador
            , 0)
    }

    function clearCategories() {
        categories.value = []
    }

    async function loadCategories() {
        try {
            const response = await axios.get('categories')
            categories.value = response.data.data
            return categories.value
        } catch (error) {
            clearCategories()
            throw error
        }
    }

    async function insertCategory(newCategory) {
        const response = await axios.post('categories', newCategory)
        categories.value.push(response.data.data)
        socket.emit('newCategory', response.data.data)
        return response.data.data
    }

    function updateCategoryOnArray(category) {
        let idx = categories.value.findIndex((t) => t.id === category.id)
        if (idx >= 0) {
            categories.value[idx] = category
        }
    }

    async function updateCategory(updateCategory) {
        let response = null;
        if(userStore.userType ==='V') {
            response = await axios.put('categories/' + updateCategory.id, updateCategory)
        } 
        else {
            response = await axios.put('categories/default/' + updateCategory.id, updateCategory)
        } 
        updateCategoryOnArray(response.data.data)
        socket.emit('updateCategory', response.data.data)
        return response.data.data
    }

    function deleteCategoryOnArray(category) {
        let idx = categories.value.findIndex((t) => t.id === category.id)
        if (idx >= 0) {
            categories.value.splice(idx, 1)
        }
    }

    async function deleteCategory( deleteCategory) {
        let response = null;
        if(userStore.userType ==='V') {
            response = await axios.delete('categories/' + deleteCategory.id)
        } 
        else {
            response = await axios.delete('categories/default/' + deleteCategory.id)
        } 
        deleteCategoryOnArray(response.data.data)
        socket.emit('deleteCategory', response.data.data)
        return response.data.data
    }

    socket.on('newCategory', (category) => {
        categories.value.push(category)
        toast.success(`A new category was created (#${category.id} : ${category.name})`)
    })

    socket.on('updateCategory', (category) => {
        updateCategoryOnArray(category)
        toast.info(`The category (#${category.id} : ${category.name}) was updated!`)
    })

    socket.on('deleteCategory', (category) => {
        deleteCategoryOnArray(category)
        toast.info(`The category (#${category.id} : ${category.name}) was deleted!`)
    })       

    return {
        categories,
        totalCategories,
        totalDebitCategories,
        totalCreditCategories,
        getCategoriesByFilter,
        getCategoriessByFilterTotal,
        loadCategories,
        clearCategories,
        insertCategory,
        updateCategory,
        deleteCategory
    }
})
