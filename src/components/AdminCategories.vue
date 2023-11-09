<script setup>
import config from '../utils/config.js'
import Category from './admin/Category.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios';

const categories = ref([])

const fetchCategories = async () => {
    const response = await axios.get(`${config.baseAPI}/categories`)
    categories.value = response.data.data
}

const deleteCategory = async (category) => {
    await axios.delete(`${config.baseAPI}/categories/${category.id}`);
    refresh();
}

const updateCategory = async (category) => {
  await axios.put(`${config.baseAPI}/categories/${category.id}`, category)
  refresh()
}

const refresh = () => {
    fetchCategories()
}

onMounted(() => {
  refresh()
})

</script>

<template>
    <br>
    <div class="container border">
        <div class="d-flex">
            <div class="flex-grow-1">
                <h4 class="mt-3">[AdminCategories.vue]</h4>
            </div>
            <div class="flex-grow-0 d-flex flex-column justify-content-end">
                <button type="button" class="btn btn-dark" @click="refresh">
                    <i class="bi-repeat" aria-hidden="true"></i> Refresh
                </button>
            </div>
        </div>
        <hr>
            <div>
        <ul class="list-group">
            <Category v-for="category in categories" :key="category.id" 
                :category="category" 
                @requestRemoveFromList="deleteCategory"
                @requestUpdateCategory="updateCategory"></Category>
        </ul>
    
    </div>
</div>
</template>
