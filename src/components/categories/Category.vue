<script setup>
import { ref, computed } from 'vue'

import CategoryDetail from './CategoryDetail.vue'

const categoryEdit = ref(null)

const props = defineProps({
    category: Object,
})

const emit = defineEmits([
    'delete',
    'update'
])

const deleteCategory = (category) => {
    emit('delete', category)
}

const editCategory = (category) => {
    categoryEdit.value = category
}

const closeEdit = () => {
    categoryEdit.value = null
}

const updateCategory = (category) => {
    categoryEdit.value = null
    emit('update', category)
}

</script>

<template>
    <li class="list-group-item">
        <span>{{ category.name }}</span>
        <div class="float-end">
            <button class="btn btn-danger btn-xs" @click="deleteCategory(category)">
                <i class="bi-trash" aria-hidden="true"></i>
            </button>

            <button class="btn btn-info btn-xs" @click="editCategory(category)" v-if="!categoryEdit">
                <i class="bi-pencil" aria-hidden="true"></i>
            </button>
            <button class="btn btn-warning btn-xs" @click="closeEdit" v-else>
                <i class="bi-arrow-up" aria-hidden="true"></i>
            </button>
        </div>
        <div v-if="categoryEdit">
            <hr>
            <CategoryDetail :category="categoryEdit" @update="updateCategory" @hide="closeEdit"></CategoryDetail>
        </div>
    </li>
</template>


<style scoped>

button.btn {
    margin-left: 5px;
}
</style>
