<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import CategoryList from './CategoryList.vue'
import NewCategory from './NewCategory.vue'

const categories = ref([])

const addCategory = async (newCategory) => {
  if (newCategory) {
    const response = await axios.post('/categories', newCategory)         
    const savedCategory = response.data.data
    categories.value.push(savedCategory)
  }
}

const deleteCategory = async (category) => {
  const response = await axios.delete(`/categories/${category.id}`);        
  const deletedCategory = response.data.data
  const idx = categories.value.findIndex((element) => element.id === deletedCategory.id)
  if (idx >= 0) {
    categories.value.splice(idx, 1)
  }
}

const updateCategory = async (category) => {
  
  const response = await axios.put('/categories/' + category.id, category)  
  const savedCategory = response.data.data   
  
  let idx = categories.value.findIndex((t) => t.id === savedCategory.id)
  if (idx >= 0) {
    categories.value[idx] = savedCategory
  }
}

const fetchCategories = async () => {
  const response = await axios.get("/categories")
  categories.value = response.data.data
}

const refresh = async () => {
  const promiseCategories = fetchCategories()
  await promiseCategories
}

onMounted(async () => {
  await refresh()
})

</script>

<template>
  <div class="container">
    <div class="d-flex">
      <div class="flex-grow-1">
        <h1 class="mt-3">Category List</h1>
      </div>
      <div class="flex-grow-0 d-flex flex-column justify-content-end">
        <button type="button" class="btn btn-dark" @click="refresh">
            <i class="bi-repeat" aria-hidden="true"></i> Refresh
        </button>
      </div>
    </div>
    <hr>
    <div>
      <hr>
      <NewCategory @add="addCategory"></NewCategory>
      <h3>Categories</h3>
      <CategoryList :categories="categories" :readonly="false" 
          @delete="deleteCategory"
          @update="updateCategory">
        </CategoryList>
    </div>
  </div>
</template>

<style>
  .error {
    font-size: small;
    display: block;
    color: red;
    margin: 3px 0 5px 8px;
    /* margin: -15px 0 6px 16px; */
  }

  span.error {
    font-size: small;
    display: block;
    color: red;
  }

  .errors {
    font-size: small;
    display: block;
    color: red;
  }

</style>