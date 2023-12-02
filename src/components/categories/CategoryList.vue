<script setup>
import Category from './Category.vue'

const props = defineProps({
    categories: Array
})

const emit = defineEmits([
    'delete',
    'update'
])

const deleteCategory = (category) => {
    emit('delete', category)
}

const updateCategory = (category) => {
    emit("update", category)
}
</script>

<template>
    <div>
        <ul class="list-group">
            <Category v-for="category in categories" :key="category.id" 
                :category="category" 
                @delete="deleteCategory"
                @update="updateCategory"></Category>
        </ul>
    </div>
</template>
